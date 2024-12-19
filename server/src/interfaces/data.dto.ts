import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DataDto {
    @IsString()
    @IsNotEmpty()
    query: string;
}

export class AddDataDto {
    @IsNumber()
    @IsNotEmpty()
    offset: number;
}