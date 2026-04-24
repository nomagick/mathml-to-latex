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

    const content = mathMLElementToLaTeXConverter(children[0] ?? new VoidMathMLElement()).convert();
    const rootIndex = mathMLElementToLaTeXConverter(children[1] ?? new VoidMathMLElement()).convert();

    return `\\sqrt[${rootIndex}]{${content}}`;
  }
}
