import { apiGet } from "@/handlers/apiHandler";
import { MenuAccordion } from "../MenuAccordion";
import { ItemAdded } from "../ItemAdded";
import { BreadCrumb } from "../Breadcrumb";
import { Gallery } from "../Gallery";
import { Header } from "../Header";
import { Call } from "../Call";
import { Footer } from "../Footer";
import { Details } from "../Details";
import { getTable } from "@/app/lib/tables/getTables";
import { notFound } from "next/navigation";
import { InstallApp } from "@/app/components/menu/installApp";

export async function generateMetadata({ params }) {
  const outlet = await apiGet(`/api/shop/outlet/${params.menu}`);
  if (outlet.status === 404) notFound();

  return {
    title: outlet.name,
    description: outlet.description,
    openGraph: {
      images: [outlet.logo, ...outlet?.gallery],
    },
  };
}

export default async function Home({ params }) {
  const table_id = params.table_id;
  const itemsPromis = apiGet(`/api/shop/menu/${params.menu}`);
  const outletPromis = apiGet(`/api/shop/outlet/${params.menu}`);
  const waitPromisForLoader = new Promise((resolve) =>
    setTimeout(resolve, 1000),
  );
  const [items, outlet, table] = await Promise.all([
    itemsPromis,
    outletPromis,
    getTable(table_id),
    waitPromisForLoader,
  ]);

  if (items.status === 404) notFound();
  if (outlet.status === 404) notFound();
  if (table.status === 404) notFound();

  return (
    <>
      <main className="flex w-full min-h-screen flex-col gap-4 overflow-hidden bg-gray-100">
        <div className="bg-white px-4 rounded-b-3xl shadow-[0px_2px_6px_0px_rgba(0,_0,_0,_0.1)]">
          {/* Header */}
          <Header />
          {/* Breadcrumb */}
          <BreadCrumb params={params} />
          {/* Outlet Image */}
          <Gallery outlet={outlet} />
          {/* Restaurant Details */}
          <Details outlet={outlet} />
        </div>
        <InstallApp />
        {/* Call Waiter, Bookmark, Share */}
        <Call outlet={outlet} />
        {/* Menu and Filters */}
        <div className="bg-white px-4 pt-8 rounded-t-3xl shadow-[0px_-1px_6px_0px_rgba(0,_0,_0,_0.1)]">
          <MenuAccordion items={items} outlet={outlet} />
        </div>
        {/* Item Added */}
        <ItemAdded params={params} />
      </main>
      <Footer outlet={outlet} />
    </>
  );
}
