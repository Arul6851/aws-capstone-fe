import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";
const Navbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div>
      <div className="navbar bg-base-100 my-8 py-4">
        <div className="bg-base-100 px-10 py-4 flex justify-start">
          <Link
            href="/home"
            className="btn btn-primary btn-circle normal-case text-xl flex justify-center items-center"
          >
            <TiArrowBack className="h-8 w-8" />
          </Link>
        </div>
        <img src="../assets/licet1.jpg" alt="logo" className="w-20 h-20" />
        <div className="flex-1">
          <Link href="/home" className="btn btn-ghost normal-case text-xl">
            Fee Portal
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar inline-flex justify-center items-center"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80"
                  alt="User profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="hover:bg-gray-100">
                <Link href={"home/profile"} className="justify-between p-3">
                  Profile
                </Link>
              </li>
              <li className="hover:bg-gray-100 p-3" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
