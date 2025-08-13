// React
import { Fragment } from "react";

// Components
import Header from "@shared/components/header";
import Footer from "@shared/components/footer";

// Next.js
import Link from "next/link";
import Image from "next/image";

// Images
import User1Image from "@public/images/user_1.webp";
import User2Image from "@public/images/user_2.webp";
import User3Image from "@public/images/user_3.webp";

const HomePage: React.FC = () => {
  return (
    <Fragment>
      <Header />
      <main className="flex flex-col gap-4 flex-grow container mx-auto p-4">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-center text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          SELECT A USER
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/user/1" className="h-auto aspect-square">
            <Image
              className="h-full w-full object-cover object-top rounded-lg"
              src={User1Image}
              alt="User 1"
              width={750}
              height={1125}
            />
          </Link>
          <Link href="/user/1" className="h-auto aspect-square">
            <Image
              className="h-full w-full object-cover object-top rounded-lg"
              src={User2Image}
              alt="User 2"
              width={750}
              height={750}
            />
          </Link>
          <Link href="/user/1" className="h-auto aspect-square">
            <Image
              className="h-full w-full object-cover object-top rounded-lg"
              src={User3Image}
              alt="User 3"
              width={750}
              height={1125}
            />
          </Link>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
