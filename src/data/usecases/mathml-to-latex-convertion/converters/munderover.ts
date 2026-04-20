import { ToLaTeXConverter } from '../../../../domain/usecases/to-latex-converter';
import { MathMLElement, VoidMathMLElement } from '../../../protocols/mathml-element';
import { mathMLElementToLaTeXConverter } from '../../../helpers';

export class MUnderover implements ToLaTeXConverter {
  private readonly _mathmlElement: MathMLElement;

  constructor(mathElement: MathMLElement) {
    this._mathmlElement = mathElement;
  }

  convert(): string {
    const { children } = this._mathmlElement;

    const base = mathMLElementToLaTeXConverter(children[0] ?? new VoidMathMLElement()).convert();
    const underContent = mathMLElementToLaTeXConverter(children[1] ?? new VoidMathMLElement()).convert();
    const overContent = mathMLElementToLaTeXConverter(children[2] ?? new VoidMathMLElement()).convert();

    return `${base}_{${underContent}}^{${overContent}}`;
  }
}
