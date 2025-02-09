import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class NickNameValidator implements ValidatorConstraintInterface {
  validate(nickName: string, args: ValidationArguments) {
    // 닉네임 길이 검사 (2~8글자)
    if (nickName.length < 2 || nickName.length > 8) {
      return false;
    }

    // 알파벳 및 숫자만 허용
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(nickName)) {
      return false;
    }

    // 자음 및 모음 단독 사용 불가
    const singleCharRegex = /[ㄱ-ㅎㅏ-ㅣ]/;
    if (singleCharRegex.test(nickName)) {
      return false;
    }

    // 모든 조건 통과
    return true;
  }

  defaultMessage() {
    return '닉네임은 2~8글자, 알파벳 및 숫자만 허용, 자음 및 모음 단독 사용 불가합니다.';
  }
}

export function IsAllowedNickName(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NickNameValidator,
    });
  };
}
