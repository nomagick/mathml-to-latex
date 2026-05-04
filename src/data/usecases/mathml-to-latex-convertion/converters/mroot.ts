import { ToLaTeXConverter } from '../../../../domain/usecases/to-latex-converter';
import { MathMLElement, VoidMathMLElement } from '../../../protocols/mathml-element';
import { mathMLElementToLaTeXConverter } from '../../../helpers';

export class MRoot implements ToLaTeXConverter {
  private readonly _mathmlElement: MathMLElement;

  constructor(mathElement: MathMLElement) {
    this._mathmlElement = mathElement;
  }

  convert(): string {
    const { children } = this._mathmlElement;
    const _void = new VoidMathMLElement();

    const content = mathMLElementToLaTeXConverter(children[0] || _void).convert();
    const rootIndex = mathMLElementToLaTeXConverter(children[1] || _void).convert();

    return `\\sqrt[${rootIndex}]{${content}}`;
  }
}
