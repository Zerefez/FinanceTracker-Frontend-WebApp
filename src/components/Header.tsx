import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-[100wh] border-b-2 border-black mx-8 pt-6 pb-4 top-0 bg-white z-10">
      <div className="px-2 md:px-4 items-stretch justify-items-stretch">
        <div className=" grid grid-cols-1 md:grid-cols-4 gap-[100px] text-md ">
          {/* First Column */}
          <div className="space-y-1 ">
            <p className="text-muted font-medium">App</p>
            <button className="uppercase font-bold">Finance Tracker</button>
            <p className="text-muted">GMT+1 (07:18 PM, DK)</p>
          </div>

          {/* Second Column */} 
          <div className="space-y-1">
            <p className="text-muted first-line:font-medium">Status</p>
            <p className="uppercase">New generated paycheck Currently available for viewing</p>
          </div>

          {/* Third Column */} 
          <div className="space-y-1">
            <p className="text-muted font-medium">Sitemap</p>
            <p className="uppercase">
              <Link to="/">Home</Link>, <Link to="/paycheck">Paycheck</Link>, <Link to="/student-grant">Student Grant</Link>, <Link to="/vacation-pay">Vacation Pay</Link>
            </p>
          </div>

          {/* Fourth Column */}
          <div className="space-y-1">
            <p className="text-muted font-medium">User</p>
            <p className="uppercase">
              Login, Service, Contact Us
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
