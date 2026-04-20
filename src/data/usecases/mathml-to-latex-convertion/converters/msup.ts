import { ToLaTeXConverter } from '../../../../domain/usecases/to-latex-converter';
import { MathMLElement, VoidMathMLElement } from '../../../protocols/mathml-element';
import { mathMLElementToLaTeXConverter, ParenthesisWrapper, BracketWrapper } from '../../../helpers';

export class MSup implements ToLaTeXConverter {
  private readonly _mathmlElement: MathMLElement;

  constructor(mathElement: MathMLElement) {
    this._mathmlElement = mathElement;
  }

  convert(): string {
    const { children } = this._mathmlElement;

    const baseChild = children[0] ?? new VoidMathMLElement();
    const exponentChild = children[1] ?? new VoidMathMLElement();
    const base = this._handleBaseChild(baseChild);
    const safeBase = base === '' ? '{}' : base;

    return `${safeBase}^${this._handleExponentChild(exponentChild)}`;
  }

  private _handleBaseChild(base: MathMLElement): string {
    const baseChildren = base.children;
    const baseStr = mathMLElementToLaTeXConverter(base).convert();

    if (baseChildren.length <= 1) {
      return baseStr;
    }

    return new ParenthesisWrapper().wrapIfMoreThanOneChar(baseStr);
  }

  private _handleExponentChild(exponent: MathMLElement): string {
    const exponentStr = mathMLElementToLaTeXConverter(exponent).convert();

    return new BracketWrapper().wrap(exponentStr);
  }
}
