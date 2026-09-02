import { notFound } from "next/navigation";

// proxy.ts rewrites every public path into the [locale] tree, so an unknown path
// lands here and gets the localized not-found page instead of the framework default.
export default function CatchAll() {
  notFound();
}
