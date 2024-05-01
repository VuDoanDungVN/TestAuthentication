import { prisma } from '@/app/_utils/prismaSingleton';
import type { Prisma } from '@prisma/client';

export type Post = Exclude<Prisma.PromiseReturnType<typeof PostRepository.findUnique>, null>;

export namespace PostRepository {
  export async function findMany() {
    return await prisma.post.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
  }

  export async function findUnique(id: string) {
    return await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  }
  //Đầu tiên tạo truy vấn trên Prisma để tạo một bài viết mới.
  //Sau đó chuyển sang API để tạo một hàm tạo bài viết mới.
  export async function create(post: Post) {
    return await prisma.post.create({
      data: {
        ...post,
      },
    });
  }
}
