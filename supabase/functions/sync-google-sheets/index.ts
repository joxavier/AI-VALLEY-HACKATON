import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    // Verify user is authenticated
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check user is a provider
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: provider } = await adminClient
      .from("providers")
      .select("id")
      .eq("user_id", claims.claims.sub)
      .maybeSingle();

    if (!provider) {
      return new Response(JSON.stringify({ error: "Only providers can sync data" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GOOGLE_SHEETS_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!sheetId) {
      return new Response(JSON.stringify({ error: "GOOGLE_SHEET_ID not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse optional sheet range from query params
    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "Sheet2";

    // Fetch data from Google Sheets
    const sheetsUrl = `${SHEETS_API_BASE}/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const sheetsRes = await fetch(sheetsUrl);

    if (!sheetsRes.ok) {
      const errBody = await sheetsRes.text();
      console.error("Google Sheets API error:", sheetsRes.status, errBody);
      return new Response(
        JSON.stringify({ error: `Google Sheets API failed [${sheetsRes.status}]`, details: errBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sheetsData = await sheetsRes.json();
    const rows: string[][] = sheetsData.values || [];

    if (rows.length < 2) {
      return new Response(JSON.stringify({ message: "No data rows found", synced: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Skip header row. Map columns A-AD per the user's schema:
    // A: Booking ID, B: Group Booking, C: Customer ID, D: Customer Name,
    // E: Customer Email, F: Customer Phone, G: Number of Participants,
    // H: All Participants, I: Service ID, J: Provider Name, K: Provider ID,
    // L: Location Type, M: Parlour ID, N: Parlour Name, O: Address,
    // P: City, Q: Postal Code, R: Coordinates, S: Scheduled Time,
    // T: Duration, U: Service Price, V: Payment Status, W: Total Amount,
    // X: Booking Status, Y: Customization Notes, Z: Customer Notes,
    // AA: Booking Notes, AB: Configurations, AC: Created At, AD: Updated At
    const dataRows = rows.slice(1);
    let synced = 0;
    const errors: string[] = [];

    for (const row of dataRows) {
      const bookingId = row[0]?.trim();
      if (!bookingId) continue;

      const customerEmail = row[4]?.trim();
      const customerName = row[3]?.trim();
      if (!customerEmail || !customerName) {
        errors.push(`Row ${bookingId}: missing customer name or email`);
        continue;
      }

      try {
        // Upsert booking
        const { data: bookingRecord, error: bookingErr } = await adminClient
          .from("bookings")
          .upsert(
            {
              booking_id: bookingId,
              group_booking: (row[1] || "").toLowerCase() === "yes",
              customer_id: row[2] || null,
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: row[5] || null,
              total_amount: parseFloat(row[22]) || 0,
              status: row[23] || "pending",
              customer_notes: row[25] || null,
              notes: row[26] || null,
            },
            { onConflict: "booking_id" }
          )
          .select("id")
          .single();

        if (bookingErr) {
          errors.push(`Booking ${bookingId}: ${bookingErr.message}`);
          continue;
        }

        const dbBookingId = bookingRecord.id;

        // Upsert service - delete existing and re-insert for simplicity
        await adminClient
          .from("booking_services")
          .delete()
          .eq("booking_id", dbBookingId);

        const scheduledTime = row[18] ? row[18] : null;

        await adminClient.from("booking_services").insert({
          booking_id: dbBookingId,
          service_id: row[8] || null,
          provider_name: row[9] || null,
          location_type: row[11] || "parlour",
          parlour_id: row[12] || null,
          parlour_name: row[13] || null,
          address: row[14] || null,
          city: row[15] || null,
          postal_code: row[16] || null,
          coordinates: row[17] || null,
          scheduled_time: scheduledTime,
          duration: parseInt(row[19]) || null,
          price: parseFloat(row[20]) || 0,
          payment_status: row[21] || "unpaid",
          customization_notes: row[24] || null,
          configurations: row[27] ? JSON.parse(row[27]) : {},
        });

        // Handle participants
        await adminClient
          .from("booking_participants")
          .delete()
          .eq("booking_id", dbBookingId);

        const participantsStr = row[7]?.trim();
        if (participantsStr) {
          // Expect comma-separated names or "Name (email, phone)" format
          const names = participantsStr.split(",").map((n: string) => n.trim()).filter(Boolean);
          if (names.length > 0) {
            await adminClient.from("booking_participants").insert(
              names.map((name: string) => ({
                booking_id: dbBookingId,
                name,
              }))
            );
          }
        }

        synced++;
      } catch (rowErr) {
        errors.push(`Booking ${bookingId}: ${rowErr instanceof Error ? rowErr.message : "Unknown error"}`);
      }
    }

    return new Response(
      JSON.stringify({ message: "Sync complete", synced, total: dataRows.length, errors }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
