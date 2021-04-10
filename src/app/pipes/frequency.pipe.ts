import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'frequency'
})
export class FrequencyPipe implements PipeTransform {
	populations = [
	{ name: "African", code: "AFR" },
	{ name: "American", code: "AMR" },
	{ name: "Ashkenazi Jewish", code: "ASJ" },
	{ name: "East Asian", code: "EAS" },
	{ name: "Finnish", code: "FIN" },
	{ name: "Non-Finnish European", code: "NFE" },
	{ name: "Other", code: "OTH" },
	{ name: "South Asian", code: "SAS" },
	{ name: "Amish", code: "AMI"}
	];

	transform(value: string, ...args: unknown[]): string {
		this.populations.forEach(function (pop){
			if (pop.code == value) {
				value = pop.name;
				return;
			}
		});
		return value;
	}

}
