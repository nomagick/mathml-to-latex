import { ToLaTeXConverter } from '../../../../domain/usecases/to-latex-converter';
import { MathMLElement, VoidMathMLElement } from '../../../protocols/mathml-element';
import { ParenthesisWrapper, mathMLElementToLaTeXConverter } from '../../../helpers';

export class MFrac implements ToLaTeXConverter {
  private readonly _mathmlElement: MathMLElement;

  constructor(mathElement: MathMLElement) {
    this._mathmlElement = mathElement;
  }

  convert(): string {
    const { children } = this._mathmlElement;

    const num = mathMLElementToLaTeXConverter(children[0] ?? new VoidMathMLElement()).convert();
    const den = mathMLElementToLaTeXConverter(children[1] ?? new VoidMathMLElement()).convert();

    if (this._isBevelled()) return `${this._wrapIfMoreThanOneChar(num)}/${this._wrapIfMoreThanOneChar(den)}`;

    return `\\frac{${num}}{${den}}`;
  }

  private _wrapIfMoreThanOneChar(str: string): string {
    return new ParenthesisWrapper().wrapIfMoreThanOneChar(str);
  }

  private _isBevelled(): boolean {
    return !!this._mathmlElement.attributes.bevelled;
  }
}
