import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";
import { RoutePolices } from "src/auth/enum/route-policies.enum";

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsEnum(RoutePolices)
  routePolicies: RoutePolices;
}
