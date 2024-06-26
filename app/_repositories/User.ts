import { prisma } from '@/app/_utils/prismaSingleton';
import type { Prisma } from '@prisma/client';
import type { User as _User } from '@prisma/client';
import { PersonalInformation } from './PersonalInformation';

//Hàm này để lấy ra thông tin của user
export type User = _User;
//Hàm này để lấy ra thông tin của user có thông tin cá nhân và địa chỉ đã được gộp vào
export type UserWithPersonalAndAddress = Exclude<
  Prisma.PromiseReturnType<typeof UserRepository.findUniqueWithPersonalAndAddress>,
  null
>;

//Hàm này để liệt kê dạng danh sách các tài khoản có các nội dung như trong include
export namespace UserRepository {
  export async function findMany() {
    return await prisma.user.findMany({
      include: {
        address: true,
        conversation: true,
        messages: true,
        personalInformation: true,
        posts: true,
        role: true,
      },
    });
  }
  //Hàm này để lựa chọn chọn lọc theo id
  export async function findUnique(id: string) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  //Hàm này để lựa chọn chọn lọc theo id và include các thông tin cá nhân và địa chỉ của user đó
  export async function findUniqueWithPersonalAndAddress(id: string) {
    return await prisma.user.findUnique({
      include: {
        address: true,
        conversation: true,
        messages: true,
        personalInformation: true,
        posts: true,
        role: true,
      },
      where: {
        id: id,
      },
    });
  }
  //Hàm này để tạo mới một tài khoản
  export async function create(user: User, personalInfo: PersonalInformation) {
    // Tạo mới User
    const createdUser = await prisma.user.create({
      data: user,
      include: {
        address: true,
        conversation: true,
        messages: true,
        personalInformation: true,
        posts: true,
        role: true,
      },
    });

    // Liên kết User với PersonalInformation
    await prisma.personalInformation.create({
      data: {
        ...personalInfo,
        userId: createdUser.id, // Sử dụng id của User mới tạo
      },
    });

    // Trả về User mới đã tạo
    return createdUser;
  }

  //Hàm này để cập nhật thông tin của một tài khoản
  export async function update(id: string, user: User) {
    const { updatedAt, ...userWithoutUpdatedAt } = user;
    return await prisma.user.update({
      where: {
        id: id,
        updatedAt: updatedAt,
      },
      data: {
        ...userWithoutUpdatedAt,
      },
    });
  }
  //Hàm này để xóa một tài khoản
  export async function remove(id: string) {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
