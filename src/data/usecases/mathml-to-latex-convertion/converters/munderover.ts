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
    const _void = new VoidMathMLElement();

    const base = mathMLElementToLaTeXConverter(children[0] || _void).convert();
    const underContent = mathMLElementToLaTeXConverter(children[1] || _void).convert();
    const overContent = mathMLElementToLaTeXConverter(children[2] || _void).convert();

    return `${base}_{${underContent}}^{${overContent}}`;
  }
}
