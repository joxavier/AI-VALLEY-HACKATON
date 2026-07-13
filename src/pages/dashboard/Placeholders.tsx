import { Placeholder } from "@/components/dashboard/Placeholder";
import { CalendarDays, Users, CreditCard, Scissors, Settings as SettingsIcon } from "lucide-react";

export const CalendarPage = () => (
  <Placeholder title="Calendar" description="Day, week, and month views with drag-and-drop rescheduling." Icon={CalendarDays} />
);
export const ClientsPage = () => (
  <Placeholder title="Clients" description="Customer profiles, booking history, and lifetime value." Icon={Users} />
);
export const PaymentsPage = () => (
  <Placeholder title="Payments" description="Deposits, invoices, and payout tracking." Icon={CreditCard} />
);
export const ServicesPage = () => (
  <Placeholder title="Services" description="Manage your service catalog, pricing, and durations." Icon={Scissors} />
);
export const SettingsPage = () => (
  <Placeholder title="Settings" description="Business profile, working hours, and notifications." Icon={SettingsIcon} />
);
