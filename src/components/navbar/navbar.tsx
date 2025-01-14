import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import useAuth from "../../hooks/useAuth";
import { handleLogout } from "../../services/auth";
import krakedevHorizontal from "../../assets/krakedev-horizontal.png";

export default function MainNavbar() {
  const { user } = useAuth();

  return (
    <Navbar className="bg-purple-500 " maxWidth="full">
      <NavbarBrand>
        <img src={krakedevHorizontal} className="object-contain w-36 h-32" />
      </NavbarBrand>
      {user && (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={user.email ?? ""}
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Salir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
    </Navbar>
  );
}
