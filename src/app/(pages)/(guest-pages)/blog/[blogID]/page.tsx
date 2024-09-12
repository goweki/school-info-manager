"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Media, Student, Guardian } from "@prisma/client";
import { DataContext } from "@/components/mols/providers";
import WithBreadcrumbLayout from "@/components/layouts/withBreadcrumb";

export default function BlogPost({ params }: { params: any }) {
  const { blogID } = params;
  const {
    data: { media },
    // refreshData,
  } = useContext(DataContext);

  const [selected, setSelected] = useState<Media>();
  const [UIstate, setUIstate] = useState("");

  // dont preserve scroll position
  // const pathname = usePathname();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  // get blogpost by blogID
  useEffect(() => {
    if (blogID && media) {
      setSelected(media.find(({ id }: { id: string }) => id === blogID));
    }
    setUIstate("OK");
  }, [blogID, media]);

  // UIstate OK on UI error
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);

  //render
  return UIstate && selected ? (
    <WithBreadcrumbLayout
      paths={[{ name: "All Blogposts", link: "/blog" }]}
      pageName="post"
    >
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 antialiased max-w-4xl mx-auto">
        <div className="flex justify-between px-4 mx-auto">
          <article className="mx-auto w-full format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <figure className="flex flex-col items-center m-4 lg:my-8">
              <img src={selected.image} alt="" />
              {/* <figcaption className="opacity-75 italic">
                Digital art by Anonymous
              </figcaption> */}
            </figure>
            <header className="mb-4 lg:mb-6 not-format">
              {/* <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm">
                  <img
                    className="mr-4 w-16 h-16 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                    alt="Jese Leos"
                  />
                  <div>
                    <a href="#" rel="author" className="text-xl font-bold">
                      Jese Leos
                    </a>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      Graphic Designer, educator & CEO Flowbite
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      <time dateTime="2022-02-08" title="February 8th, 2022">
                        Feb. 8, 2022
                      </time>
                    </p>
                  </div>
                </div>
              </address> */}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight lg:mb-6 lg:text-4xl">
                {selected.title}
              </h1>
            </header>
            <ReactMarkdown className="reactMarkDown">
              {selected.content}
            </ReactMarkdown>
          </article>
        </div>
      </main>
    </WithBreadcrumbLayout>
  ) : null;
}

// import { useContext, useState, useEffect } from "react";
// import Link from "next/link";
// // import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { DataContext } from "@/app/dashboard/providers";
// import {
//   SVGbuilding,
//   SVGcell,
//   SVGemail,
//   SVGpenscilSquare,
//   SVGuser,
// } from "@/components/atoms/svgs";
// import {
//   ButtonPrimary,
//   ButtonSecondary,
//   ButtonDestructive,
// } from "@/components/atoms/buttons";
// import { InputText } from "@/components/atoms/inputs";
// import { strPascalcase } from "@/helpers/stringHandlers";
// import toast from "react-hot-toast";
// import { Loader1 } from "@/components/atoms/loader";
// import ViewInstitution from "./_components/viewInstitut";
// import { nameValidator, telValidator } from "@/helpers/inputValidators";
// import { httpCodes } from "@/lib/configs";

// export default function InstitutionsPage({ params }) {
//   const defaultInstitution = {
//     name: { value: "", error: "" },
//     email: { value: "", error: "" },
//     tel: { value: "", error: "" },
//   };
//   const { instIDuser } = params;
//   const {
//     data: { institutions, users },
//     refreshData,
//   } = useContext(DataContext);
//   // state Objects
//   const router = useRouter();
//   const [selected, setSelected] = useState("");
//   const [UIstate, setUIstate] = useState("");
//   const [newInstitution, setNewInstitution] = useState(defaultInstitution);
//   //

//   // check slug and update selected
//   useEffect(() => {
//     if (instIDuser[0] !== "new") {
//       setSelected(institutions.find(({ id }) => id === instIDuser[0]));
//     } else setUIstate("OK");
//   }, [institutions, instIDuser]);

//   // UIstate OK after updating selected
//   useEffect(() => {
//     if (selected) {
//       setUIstate("OK");
//     }
//   }, [selected, router]);

//   // UIstate OK on UI error
//   useEffect(() => {
//     if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
//       toast.error(UIstate);
//       setUIstate("OK");
//     }
//   }, [UIstate]);

//   // toast on input error
//   useEffect(() => {
//     if (newInstitution.email.error) toast.error(newInstitution.email.error);
//     if (newInstitution.name.error) toast.error(newInstitution.name.error);
//     if (newInstitution.tel.error) toast.error(newInstitution.tel.error);
//     setNewInstitution((prev) => ({
//       ...prev,
//       email: { ...prev.email, error: "" },
//       name: { ...prev.name, error: "" },
//       tel: { ...prev.tel, error: "" },
//     }));
//   }, [
//     newInstitution.email.error,
//     newInstitution.name.error,
//     newInstitution.tel.error,
//   ]);

//   //submit new institution
//   async function initializeInstitution(e) {
//     e.preventDefault();
//     //validate email
//     const emailError_ = nameValidator(newInstitution.name.value);
//     if (emailError_) {
//       setNewInstitution((prev) => ({
//         ...prev,
//         email: {
//           ...prev.name,
//           error: emailError_,
//         },
//       }));
//       toast.error(emailError_);
//       return;
//     }
//     //validate name
//     const nameError_ = nameValidator(newInstitution.name.value);
//     if (nameError_) {
//       setNewInstitution((prev) => ({
//         ...prev,
//         name: {
//           ...prev.name,
//           error: emailError_,
//         },
//       }));
//       toast.error(emailError_);
//       return;
//     }
//     //validate tel
//     let telError_ = "";
//     if (tel) {
//       telError_ = telValidator(newInstitution.tel.value);
//     }
//     if (telError_) {
//       setNewInstitution((prev) => ({
//         ...prev,
//         tel: {
//           ...prev.tel,
//           error: telError_,
//         },
//       }));
//       toast.error(telError_);
//       return;
//     }
//     setUIstate("loading");
//     try {
//       // fetch options
//       let fetchOptions = {
//         method: "POST",
//         // headers: {
//         //   "Content-Type": "application/json",
//         //   'Content-Type': 'application/x-www-form-urlencoded',
//         // },
//         body: JSON.stringify({
//           email: newInstitution.email.value,
//           name: newInstitution.name.value,
//           tel: newInstitution.tel.value,
//         }),
//       };
//       // POST request using fetch
//       const _res = await fetch("/api/dashboard/institution", fetchOptions).then(
//         async (res_) => {
//           if (res_?.status === 200) {
//             return await res_.json();
//           } else {
//             console.log(`ERROR: ` + JSON.stringify(res_));
//             setUIstate(httpCodes[res_.status] || "Unknown error");
//           }
//         }
//       );
//       if (_res?.success) {
//         console.log(
//           "SUCCESS: institution initialized successfully\n > " +
//             JSON.stringify(_res.success) +
//             "\n.............."
//         );
//         toast.success("Institution initialized successfully!");
//         await refreshData();
//         router.replace(`/dashboard/institutions/${_res.success.id}`);
//       } else {
//         console.error(
//           "ERROR: failed to initialize institution at /dashboard/institutions/new /page\n > " +
//             JSON.stringify(_res) +
//             "\n.............."
//         );
//         setUIstate(_res?.failed ?? "No Response, check internet connection");
//       }
//     } catch (error) {
//       console.log("fetch failed: ", error.message);
//       setUIstate(error.message ?? "No Response, check internet connection");
//     }
//   }

//   //render
//   return !UIstate ? (
//     <Loader1 />
//   ) : (
//     <main className="flex flex-col flex-grow items-center px-4">
//       <div className="flex flex-col flex-grow max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6 w-full">
//         {/* header */}
//         <div className="space-y-1 pt-6 md:space-y-2">
//           {/* heading */}
//           <h1 className="text-center uppercase">
//             {instIDuser[0] === "new"
//               ? "New Institution"
//               : selected?.name ?? "ERROR"}
//           </h1>
//           {/* Inputs */}
//           {instIDuser[0] === "new" ? (
//             <div className="px-6 sm:px-20 md:px-12">
//               <form
//                 id="new-institution"
//                 // className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
//                 className={`relative max-w-lg mx-auto grid grid-cols-1 gap-4 card p-6`}
//                 onSubmit={initializeInstitution}
//               >
//                 <InputText
//                   valObj={newInstitution.name}
//                   setValue={(nameObj) =>
//                     setNewInstitution((prev) => ({ ...prev, name: nameObj }))
//                   }
//                   name="name"
//                   label="Institution Name *"
//                   valValidator={nameValidator}
//                   placeholder="Name of Institution"
//                   icon={SVGbuilding}
//                 />
//                 <InputText
//                   valObj={newInstitution.email}
//                   setValue={(emailObj) =>
//                     setNewInstitution((prev) => ({
//                       ...prev,
//                       email: emailObj,
//                     }))
//                   }
//                   name="email"
//                   label="Email *"
//                   valValidator={nameValidator}
//                   placeholder="Official email of institution"
//                   icon={SVGemail}
//                 />
//                 <InputText
//                   valObj={newInstitution.tel}
//                   setValue={(telObj) =>
//                     setNewInstitution((prev) => ({ ...prev, tel: telObj }))
//                   }
//                   name="tel"
//                   label="Phone No."
//                   valValidator={telValidator}
//                   placeholder="Official PhoneNo. of Institution"
//                   icon={SVGcell}
//                 />
//                 <div className="my-8">
//                   <ButtonPrimary
//                     label="Create Institution"
//                     loading={UIstate === "loading"}
//                     onClick={() => ""}
//                     disabled={
//                       !newInstitution.name.value || !newInstitution.email.value
//                     }
//                     type="submit"
//                   />
//                 </div>
//               </form>
//             </div>
//           ) : selected ? (
//             <ViewInstitution
//               selected={selected}
//               refreshData={refreshData}
//               instUsers={users.filter(({ institutionIDs }) => {
//                 for (const id of institutionIDs) {
//                   if (id === instIDuser[0]) return true;
//                 }
//               })}
//               selectedUser={
//                 instIDuser[1]
//                   ? users.find(({ id }) => id === instIDuser[1]) || "new"
//                   : null
//               }
//             />
//           ) : (
//             <div>
//               <p className="text-center">
//                 There was an error loading the contents of this page. Check
//                 internet connectivity
//               </p>
//               <p className="text-center">
//                 <Link
//                   href="/dashboard/institutions"
//                   className="text-red-800 dark:text-red-400 underline"
//                 >
//                   {" "}
//                   click here{" "}
//                 </Link>
//                 to view all institutions
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

// function inputSelect(
//   optionArr,
//   value,
//   onChange = () => "",
//   name = "inputName"
//   // defaultOption = "type"
// ) {
//   return (
//     <div className="relative mb-6">
//       <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
//         <SVGpenscilSquare className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
//       </div>
//       <select
//         name={name}
//         id={name}
//         className={`border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
//         value={value}
//         onChange={onChange}
//       >
//         <option value="" className="italic font-light">
//           Select {name}...
//         </option>
//         {optionArr.map((option, i) => (
//           <option key={optionArr.key} value={optionArr.value}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// async function fetchInst(instId) {
//   const resRaw = await fetch(`/api/dashboard/institution?id=${instId}`, {
//     method: "GET",
//   });
//   if (resRaw.ok) {
//     const res = await resRaw.json();
//     console.log("resJson 2: ", JSON.stringify(res.success));
//     return res.success;
//   }
// }

// // const caseTypes = [{ value: "petition", text: "✍🏾 petition" }];
