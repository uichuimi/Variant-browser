import { Frequency } from "../../../api/varcan-service/models/response/Frequency";
import { Population } from "../../../api/varcan-service/models/response/Population";
import { FrequencyLine } from "../../models/frequency-line";

const DECIMAL_CIPHER_APROXIMATION = 5;

export class FrequencyLineDatasource {
  private populationName: string;
  private populationCode: string;
  private frequency: string;

  constructor(frequency: Frequency, populationCache: Array<Population>) {
    if (frequency == null) {
      this.populationName = "-";
      this.populationCode = "-";
      this.frequency = "-";
    } else {
      const targetPopulation: Population = this.getPopulationNameById(frequency.population, populationCache);
      this.populationName = targetPopulation.name;
      this.populationCode = targetPopulation.code;
      let relativeFrequency: number = frequency.ac / frequency.an * 100;
      let roundRelativeFrequency = Math.round((relativeFrequency + Number.EPSILON) * 10 ** DECIMAL_CIPHER_APROXIMATION) / 10 ** DECIMAL_CIPHER_APROXIMATION;
      this.frequency = `${frequency.ac}/${frequency.an} (${roundRelativeFrequency}%)`;
    }

  }

  private getPopulationNameById(populationId: number, populationCache: Array<Population>) {
    const population: Population = populationCache
      .find((population: Population) => population.id === populationId);
    return population;
  }

  get line(): FrequencyLine {
    return {
      population: this.populationName,
      code: this.populationCode,
      [this.populationCode]: this.frequency
    }
  }
}
