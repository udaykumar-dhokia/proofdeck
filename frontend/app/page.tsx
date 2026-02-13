import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-3xl text-center justify-center">
          <span className={title()}>Turn Your&nbsp;</span>
          <span className={title({ color: "yellow" })}>Customers&nbsp;</span>
          <br />
          <span className={title()}>Into Your Best Salespeople</span>
          <div className={subtitle({ class: "mt-4" })}>
            Automatically collect, manage, and display powerful testimonials that
            increase conversions — on autopilot.
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            isExternal
            as={Link}
            color="warning"
            className="text-sm font-normal text-black"
            href={siteConfig.links.sponsor}
            endContent={<IconArrowUpRight />}
          >
            Try Now - No Credit Card Required
          </Button>
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            variant="flat"
          >
            Know More
          </Button>
        </div>
      </section>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com?utm_source=next-app-template"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-warning">proofdeck</p>
        </Link>
      </footer>
    </div >
  );
}
