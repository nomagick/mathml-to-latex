import { ToLaTeXConverter } from '../../../../domain/usecases/to-latex-converter';
import { MathMLElement, VoidMathMLElement } from '../../../protocols/mathml-element';
import { mathMLElementToLaTeXConverter, ParenthesisWrapper } from '../../../helpers';

export class MMultiscripts implements ToLaTeXConverter {
  private readonly _mathmlElement: MathMLElement;

  constructor(mathElement: MathMLElement) {
    this._mathmlElement = mathElement;
  }

  convert(): string {
    const { children } = this._mathmlElement;

    const baseContent = mathMLElementToLaTeXConverter(children[0] ?? new VoidMathMLElement()).convert();
    const prescripts = this._prescriptLatex();
    const postscripts = this._postscriptLatex();
    const wrappedBase = this._wrapInParenthesisIfThereIsSpace(baseContent);
    const safeBase = wrappedBase === '' && (prescripts !== '' || postscripts !== '') ? '{}' : wrappedBase;

    return prescripts + safeBase + postscripts;
  }

  private _prescriptLatex(): string {
    const { children } = this._mathmlElement;
    let sub;
    let sup;

    if (this._isPrescripts(children[1])) {
      sub = children[2] ?? new VoidMathMLElement();
      sup = children[3] ?? new VoidMathMLElement();
    } else if (this._isPrescripts(children[3])) {
      sub = children[4] ?? new VoidMathMLElement();
      sup = children[5] ?? new VoidMathMLElement();
    } else return '';

    const subLatex = mathMLElementToLaTeXConverter(sub).convert();
    const supLatex = mathMLElementToLaTeXConverter(sup).convert();

    return `\\_{${subLatex}}^{${supLatex}}`;
  }

  private _postscriptLatex(): string {
    const { children } = this._mathmlElement;
    if (this._isPrescripts(children[1])) return '';

    const sub = children[1] ?? new VoidMathMLElement();
    const sup = children[2] ?? new VoidMathMLElement();

    const subLatex = mathMLElementToLaTeXConverter(sub).convert();
    const supLatex = mathMLElementToLaTeXConverter(sup).convert();

    return `_{${subLatex}}^{${supLatex}}`;
  }

  private _wrapInParenthesisIfThereIsSpace(str: string): string {
    if (!str.match(/\s+/g)) return str;
    return new ParenthesisWrapper().wrap(str);
  }

  private _isPrescripts(child: MathMLElement): boolean {
    return child?.name === 'mprescripts';
  }
}
