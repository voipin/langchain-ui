import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prismaClient = new PrismaClient();

const promptTemplatesHandler = async (request, response) => {
  const session = await getServerSession(request, response, authOptions);
  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
  });

  if (request.method === "GET") {
    const data = await prismaClient.promptTemplate.findMany({
      where: {
        userId: {
          equals: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.status(200).json({
      success: true,
      data,
    });
  }

  if (request.method === "POST") {
    const promptTemplate = await prismaClient.promptTemplate.create({
      data: {
        userId: user.id,
        ...request.body,
      },
    });

    return response.status(200).json({ sucess: true, data: promptTemplate });
  }
};

export default promptTemplatesHandler;
