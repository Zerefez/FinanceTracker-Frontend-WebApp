export interface NavLink {
  title: string;
  href: string;
}

export const mainLinks: NavLink[] = [
  { title: "HOME", href: "/" },
  { title: "PAYCHECK", href: "/paycheck" },
  { title: "COMPARE PAYCHECK", href: "/paycheck-compare" },
  { title: "STUDENT GRANT", href: "/student-grant" },
  { title: "VACATION PAY", href: "/vacation-pay" }
];

export const loginLink: NavLink = { title: "LOGIN", href: "/login" };
export const logoutLink: NavLink = { title: "LOGOUT", href: "#" }; // Href will be handled with an onClick handler

export const userLinks: NavLink[] = [
  { title: "CONTACT US", href: "/contact" }
]; 