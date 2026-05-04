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
    const _void = new VoidMathMLElement();

    const baseContent = mathMLElementToLaTeXConverter(children[0] || _void).convert();

    return this._prescriptLatex() + this._wrapInParenthesisIfThereIsSpace(baseContent) + this._postscriptLatex();
  }

  private _prescriptLatex(): string {
    const { children } = this._mathmlElement;
    const _void = new VoidMathMLElement();
    let sub;
    let sup;

    if (this._isPrescripts(children[1])) {
      sub = children[2] || _void;
      sup = children[3] || _void;
    } else if (this._isPrescripts(children[3])) {
      sub = children[4] || _void;
      sup = children[5] || _void;
    } else return '';

    const subLatex = mathMLElementToLaTeXConverter(sub).convert();
    const supLatex = mathMLElementToLaTeXConverter(sup).convert();

    return `\\_{${subLatex}}^{${supLatex}}`;
  }

  private _postscriptLatex(): string {
    const { children } = this._mathmlElement;
    const _void = new VoidMathMLElement();
    if (this._isPrescripts(children[1])) return '';

    const sub = children[1] || _void;
    const sup = children[2] || _void;

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
