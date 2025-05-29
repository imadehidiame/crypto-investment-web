import { cn, log } from "@/lib/utils";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

interface NumberFieldProps {
    is_integer: boolean;
    disabled?: boolean;
    on_change: (value: string) => void;
    value: string;
    field_class?: string;
    placeholder?: string;
    flag?: {
        length_after_decimal?: number;
        allow_decimal?: boolean;
        add_if_empty?: boolean;
        allow_zero_start?: boolean;
        total_length?: number;
        format_to_thousand?: boolean;
        allow_negative_prefix?:boolean;
    }
}
const NumberField: React.FC<NumberFieldProps> = ({ flag, is_integer, on_change, value, field_class, placeholder, disabled }) => {
    const [field_value, set_field_value] = useState(value);
    useEffect(() => {
        if (value && value.length > 0) {
            set_field_value(is_integer ? NumberFormat.numbers_only(value, flag) : NumberFormat.thousands(value, flag));
            //set_field_value(value);
        } else {
            set_field_value('');
        }
    }, [value]);

    return <Input onChange={(e) => {
        const value = is_integer ? NumberFormat.numbers_only(e.target.value, flag) : NumberFormat.thousands(e.target.value, flag);
        on_change(value);
    }} value={field_value} disabled={disabled} type="text" className={cn(field_class)} placeholder={placeholder} />
}


export class NumberFormat {
    static thousands(number: string | number, flag?: Partial<{ allow_decimal?: boolean, length_after_decimal?: number, add_if_empty?: boolean, allow_zero_start?: boolean, total_length?: number }>) {
        let numb = typeof number === 'number' ? number.toString() : number;
        if (numb === '')
            return '';
        let num_array: string[] = [];
        if (flag) {
            if (flag.allow_decimal) {
                const add_extra_digits = (start = 0, end = 1, n = '') => {
                    for (let index = start; index < end; index++) {
                        n += '0';
                    }
                    return n;
                }
                num_array = numb.split('.');
                const length = flag.length_after_decimal ?? 2;
                if (flag.add_if_empty) {
                    if (num_array.length < 2) {
                        let n = '';

                        for (let index = 0; index < length; index++) {
                            n += '0';
                        }
                        num_array.push(add_extra_digits(0, length, ''));
                    } else {
                        num_array[1] = num_array[1].replaceAll(/\D/g, "");
                        num_array[1] = num_array[1].length >= length ? num_array[1].substring(0, length) : add_extra_digits(num_array[1].length, length, num_array[1]);
                    }
                }
                if (num_array.length >= 2) {
                    num_array = num_array.splice(0, 2);
                    num_array[1] = num_array[1].replace(/\D/g, "");
                    num_array[1] = num_array[1].substring(0, length);
                }

                numb = num_array[0];
            }
        }

        numb = numb.replace(/,/gi, '');
        numb = numb.replace(/\D/g, "");

        if (flag && flag.hasOwnProperty('allow_zero_start') && !flag.allow_zero_start) {

            while (String.prototype.charAt.apply(numb, [0]) == "0") {
                if (numb.length >= 2)
                    numb = numb.substring(1);
                else
                    numb = '';
            }

            if (numb == '')
                return '';

        }

        if (flag && flag.total_length && typeof flag.total_length == 'number' && flag.total_length > 0) {
            numb = numb.substring(0, flag.total_length);
        }

        let length = numb.length;
        let string_array = [];
        if (length > 3) {
            let number_of_commas = parseInt((length / 3).toString());
            let first_position = length % 3;
            if (first_position == 0) {
                number_of_commas -= 1;
                first_position = 3;
            }
            string_array = numb.split('');
            string_array[first_position - 1] = string_array[first_position - 1] + ",";
            number_of_commas -= 1;
            while (number_of_commas > 0) {
                first_position += 3;
                string_array[first_position - 1] = string_array[first_position - 1] + ",";
                number_of_commas -= 1;
            }
        } else {
            if (flag && flag.allow_decimal) {
                if (num_array.length > 1) {
                    return numb + "." + num_array[1];
                }
            }
            return numb;
        }
        if (flag && flag.allow_decimal) {

            if (flag.add_if_empty || num_array.length > 1) {
                return string_array.join('') + "." + num_array[1];
            } else {
                return string_array.join('');
            }

        }
        return string_array.join('');
    }
    static return_regex_format(str:string,extra_character?:string|null){
        const allowed_characters = extra_character ? `[+\\-${extra_character}]` : `[+\\-]`;
        const regex = new RegExp(`(^${allowed_characters}?)(.*$)`);
        return str.replace(regex,(match,p1,p2)=>{
            return p1+p2.replace(/[^\d]/g,"");
        });
    }
    static numbers_only(number: string, flag?: Partial<{ allow_decimal?: boolean, length_after_decimal?: number, allow_zero_start?: boolean, total_length?: number, format_to_thousand?: boolean, allow_negative_prefix?:boolean }>) {
        let num_array: string[] = [];
        if (flag) {
            if (flag.hasOwnProperty('allow_decimal') && flag.allow_decimal === true) {
                num_array = number.split('.');
                if (num_array.length > 2)
                    num_array = num_array.splice(0, 2);
                number = num_array[0];
            }
        }
        number = flag?.allow_negative_prefix ? this.return_regex_format(number,'-') : number.replaceAll(/\D/g, "");
        //log(number,'Number value');
        //"+123545".replaceAll(/[^+\-\$\d]/g,'');
        const negative_prefix = number.includes('-') ? number.slice(0,1) : '';
        //log(negative_prefix,'is negative prefix');

        if(negative_prefix){
            number = number.slice(1);
        }

        //log(number,'Number value after');

        if (flag && flag.allow_zero_start == false) {

            while (String.prototype.charAt.apply(number, [0]) == "0") {
                if (number.length >= 2)
                    number = number.substring(1);
                else
                    number = '';
            }

            if (number == ''){
                return negative_prefix + '';
            }

        }

        if (flag && flag.total_length && typeof flag.total_length == 'number' && flag.total_length > 0) {
            number = number.substring(0, flag.total_length);
        }


        if (flag && flag.allow_decimal) {
            if (num_array.length > 1) {
                return number + "." + num_array[1].replace(/\D/g, "").substring(0, flag.length_after_decimal);
            }
        }
        if (flag && flag.format_to_thousand) {
            return negative_prefix + this.thousands(number, flag);
        }

        return negative_prefix + number.toString();
    }
}


export default NumberField;