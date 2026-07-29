import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AuthCreateDto {
    @ApiProperty()
    @IsString()
    @MaxLength(20)
    @IsNotEmpty()
    username!: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password!: string;
}