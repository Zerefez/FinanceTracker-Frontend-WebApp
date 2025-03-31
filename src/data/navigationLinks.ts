export interface NavLink {
  title: string;
  href: string;
}

export const mainLinks: NavLink[] = [
  { title: "HOME", href: "/" },
  { title: "PAYCHECK", href: "/paycheck" },
  { title: "STUDENT GRANT", href: "/student-grant" },
  { title: "VACATION PAY", href: "/vacation-pay" }
];

export const userLinks: NavLink[] = [
  { title: "LOGIN", href: "/login" },
  { title: "SERVICE", href: "/service" },
  { title: "CONTACT US", href: "/contact" }
]; 