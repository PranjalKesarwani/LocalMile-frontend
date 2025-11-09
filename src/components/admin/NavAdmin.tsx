import logo from "../../assets/localMile.png";
import { BASE_COLORS } from "../../constant";
import { handleLogout, tokenStorage } from "../../configs/apiClient";

const NavAdmin = () => {
  const userInfo = tokenStorage.getUserInfo();

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <div
      className="w-screen p-4 flex items-center justify-between shadow-md"
      style={{ backgroundColor: BASE_COLORS.white }}
    >
      <div className="flex items-center gap-4">
        <img src={logo} alt="LocalMile" className="w-40" />
        <div
          className="h-8 w-0.5"
          style={{ backgroundColor: BASE_COLORS.lightGray }}
        />
        <h2
          className="text-xl font-bold"
          style={{ color: BASE_COLORS.primary }}
        >
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {userInfo && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p
                className="text-sm font-medium"
                style={{ color: BASE_COLORS.darkText }}
              >
                {userInfo.name || userInfo.email || "Admin"}
              </p>
              <p className="text-xs" style={{ color: BASE_COLORS.gray }}>
                {userInfo.role || "Administrator"}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: BASE_COLORS.primary }}
            >
              {(userInfo.name || userInfo.email || "A")[0].toUpperCase()}
            </div>
          </div>
        )}
        <button
          onClick={handleLogoutClick}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
          style={{
            backgroundColor: BASE_COLORS.error,
            color: BASE_COLORS.white,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavAdmin;
