import Image from "next/image";
import Link from "next/link";
import HeaderImage from "@public/icons/header.svg";

const Header: React.FC = () => {
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <span className="flex items-center">
            <Image
              src={HeaderImage}
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
              width={60}
              height={60}
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              My Founds
            </span>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
