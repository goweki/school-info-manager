import prisma from "@/lib/prisma/prisma";
import { withAuthGeneral } from "@/lib/authRouteWrappers";
import { excludeFields } from "@/lib/datahandlers";
import { User } from "@prisma/client";
export const revalidate = 60; // false | 'force-cache' | 0 | number

async function getHandler(req: Request, user: Partial<User>) {
  // const url = new URL(req.url);
  // const institutionId = url.searchParams.get("institution");
  // retrieve data
  try {
    // GET students
    const students = await prisma.student.findMany();

    // GET guardians
    const guardians = await prisma.guardian.findMany({
      include: {
        children: true,
      },
    });

    // HTTP response
    return Response.json({
      success: { students, guardians },
    });
  } catch (error) {
    // handle ERROR if caught
    console.log(` > Error caught at api/users/data GET \n  >> ${error}\n`);
    // return Response.json({ error: "SERVER ERROR" });
    return Response.json("Server error", { status: 500 });
  }
}

export const GET = withAuthGeneral(getHandler);
