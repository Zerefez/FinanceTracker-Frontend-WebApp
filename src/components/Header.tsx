import AnimatedLink from './ui/animatedLink'

export default function Header() {
  return (
    <header className="w-full border-b-2 border-black mx-8 pt-6 pb-4 bg-white z-10">
      <div className="px-2 md:px-4 items-stretch justify-items-stretch">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-[100px] text-md">
          {/* First Column */}
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">App</p>
            <AnimatedLink className="font-bold" href="/">FINANCE TRACKER</AnimatedLink>
            <p className="text-muted-foreground">GMT+1 (07:18 PM, DK)</p>
          </div>

          {/* Second Column */}
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">Status</p>
            <p className="uppercase">New generated paycheck Currently available for viewing</p>
          </div>

          {/* Third Column */}
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">Sitemap</p>
            <div className="flex flex-wrap gap-2">
              <AnimatedLink href="/">HOME</AnimatedLink>
              <span className="text-muted-foreground">,</span>
              <AnimatedLink href="/paycheck">PAYCHECK</AnimatedLink>
              <span className="text-muted-foreground">,</span>
              <AnimatedLink href="/student-grant">STUDENT GRANT</AnimatedLink>
              <span className="text-muted-foreground">,</span>
              <AnimatedLink href="/vacation-pay">VACATION PAY</AnimatedLink>
            </div>
          </div>

          {/* Fourth Column */}
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">User</p>
            <div className="flex flex-wrap gap-2">
              <AnimatedLink href="/login">LOGIN</AnimatedLink>
              <span className="text-muted-foreground">,</span>
              <AnimatedLink href="/service">SERVICE</AnimatedLink>
              <span className="text-muted-foreground">,</span>
              <AnimatedLink href="/contact">CONTACT US</AnimatedLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
