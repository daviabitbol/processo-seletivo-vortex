import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty()
    token!: string;
    @ApiProperty()
    expiresIn!: number;
}

