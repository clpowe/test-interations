// Aggregated metrics for a time period
export interface Metrics {
	avgPagesPerSession: number
	avgEngagementTimeSeconds: number
	productDetailViewRate: number // 0.0 to 1.0
	addToCartRate: number // 0.0 to 1.0
	checkoutCompletionRate: number // 0.0 to 1.0
	purchaseConversionRate: number // 0.0 to 1.0
	revenuePerSession: number // dollars
	averageOrderValue: number // dollars
}

export interface Range {
	min: number
	max: number
}

export interface BenchmarkRanges {
	avgPagesPerSession: Range
	avgEngagementTimeSeconds: Range
	productDetailViewRate: Range
	addToCartRate: Range
	checkoutCompletionRate: Range
	purchaseConversionRate: Range
	revenuePerSession: Range
	averageOrderValue: Range
}

export interface Weights {
	avgPagesPerSession: number
	avgEngagementTimeSeconds: number
	productDetailViewRate: number
	addToCartRate: number
	checkoutCompletionRate: number
	purchaseConversionRate: number
	revenuePerSession: number
	averageOrderValue: number
}

export interface Pillars {
	engagement: number
	conversion: number
	value: number
}

export class BenchmarkRangesHelper {
	static ecommerceDefaults(): BenchmarkRanges {
		return {
			avgPagesPerSession: { min: 2.0, max: 8.0 },
			avgEngagementTimeSeconds: { min: 30.0, max: 300.0 },
			productDetailViewRate: { min: 0.15, max: 0.6 },
			addToCartRate: { min: 0.02, max: 0.05 },
			checkoutCompletionRate: { min: 0.03, max: 0.08 },
			purchaseConversionRate: { min: 0.001, max: 0.004 },
			revenuePerSession: { min: 2.0, max: 5.0 },
			averageOrderValue: { min: 100.0, max: 1000.0 }
		}
	}

	static custom(
		pages: Range,
		time: Range,
		pdv: Range,
		atc: Range,
		checkout: Range,
		purchase: Range,
		rps: Range,
		aov: Range
	): BenchmarkRanges {
		return {
			avgPagesPerSession: pages,
			avgEngagementTimeSeconds: time,
			productDetailViewRate: pdv,
			addToCartRate: atc,
			checkoutCompletionRate: checkout,
			purchaseConversionRate: purchase,
			revenuePerSession: rps,
			averageOrderValue: aov
		}
	}
}

export class WeightsHelper {
	static balanced(): Weights {
		return {
			avgPagesPerSession: 0.1,
			avgEngagementTimeSeconds: 0.08,
			productDetailViewRate: 0.1,
			addToCartRate: 0.2,
			checkoutCompletionRate: 0.18,
			purchaseConversionRate: 0.18,
			revenuePerSession: 0.1,
			averageOrderValue: 0.06
		}
	}

	static conversionFocused(): Weights {
		return {
			avgPagesPerSession: 0.05,
			avgEngagementTimeSeconds: 0.05,
			productDetailViewRate: 0.08,
			addToCartRate: 0.25,
			checkoutCompletionRate: 0.22,
			purchaseConversionRate: 0.25,
			revenuePerSession: 0.07,
			averageOrderValue: 0.03
		}
	}

	static revenueFocused(): Weights {
		return {
			avgPagesPerSession: 0.05,
			avgEngagementTimeSeconds: 0.05,
			productDetailViewRate: 0.08,
			addToCartRate: 0.15,
			checkoutCompletionRate: 0.12,
			purchaseConversionRate: 0.15,
			revenuePerSession: 0.25,
			averageOrderValue: 0.15
		}
	}

	static normalize(weights: Weights): Weights {
		const sum =
			weights.avgPagesPerSession +
			weights.avgEngagementTimeSeconds +
			weights.productDetailViewRate +
			weights.addToCartRate +
			weights.checkoutCompletionRate +
			weights.purchaseConversionRate +
			weights.revenuePerSession +
			weights.averageOrderValue

		if (sum > 0.0) {
			return {
				avgPagesPerSession: weights.avgPagesPerSession / sum,
				avgEngagementTimeSeconds: weights.avgEngagementTimeSeconds / sum,
				productDetailViewRate: weights.productDetailViewRate / sum,
				addToCartRate: weights.addToCartRate / sum,
				checkoutCompletionRate: weights.checkoutCompletionRate / sum,
				purchaseConversionRate: weights.purchaseConversionRate / sum,
				revenuePerSession: weights.revenuePerSession / sum,
				averageOrderValue: weights.averageOrderValue / sum
			}
		}

		return weights
	}
}

export class UEHM {
	private benchmarks: BenchmarkRanges
	private weights: Weights

	constructor(benchmarks: BenchmarkRanges, weights: Weights) {
		this.benchmarks = benchmarks
		this.weights = WeightsHelper.normalize(weights)
	}

	private normalize(value: number, min: number, max: number): number {
		if (max <= min) return 50.0
		const score = ((value - min) / (max - min)) * 100.0
		return Math.max(0.0, Math.min(100.0, score))
	}

	calculateScore(metrics: Metrics): number {
		const pagesScore = this.normalize(
			metrics.avgPagesPerSession,
			this.benchmarks.avgPagesPerSession.min,
			this.benchmarks.avgPagesPerSession.max
		)

		const timeScore = this.normalize(
			metrics.avgEngagementTimeSeconds,
			this.benchmarks.avgEngagementTimeSeconds.min,
			this.benchmarks.avgEngagementTimeSeconds.max
		)

		const pdvScore = this.normalize(
			metrics.productDetailViewRate,
			this.benchmarks.productDetailViewRate.min,
			this.benchmarks.productDetailViewRate.max
		)

		const atcScore = this.normalize(
			metrics.addToCartRate,
			this.benchmarks.addToCartRate.min,
			this.benchmarks.addToCartRate.max
		)

		const checkoutScore = this.normalize(
			metrics.checkoutCompletionRate,
			this.benchmarks.checkoutCompletionRate.min,
			this.benchmarks.checkoutCompletionRate.max
		)

		const purchaseScore = this.normalize(
			metrics.purchaseConversionRate,
			this.benchmarks.purchaseConversionRate.min,
			this.benchmarks.purchaseConversionRate.max
		)

		const rpsScore = this.normalize(
			metrics.revenuePerSession,
			this.benchmarks.revenuePerSession.min,
			this.benchmarks.revenuePerSession.max
		)

		const aovScore = this.normalize(
			metrics.averageOrderValue,
			this.benchmarks.averageOrderValue.min,
			this.benchmarks.averageOrderValue.max
		)

		return (
			pagesScore * this.weights.avgPagesPerSession +
			timeScore * this.weights.avgEngagementTimeSeconds +
			pdvScore * this.weights.productDetailViewRate +
			atcScore * this.weights.addToCartRate +
			checkoutScore * this.weights.checkoutCompletionRate +
			purchaseScore * this.weights.purchaseConversionRate +
			rpsScore * this.weights.revenuePerSession +
			aovScore * this.weights.averageOrderValue
		)
	}

	calculatePillars(metrics: Metrics): Pillars {
		const pagesScore = this.normalize(
			metrics.avgPagesPerSession,
			this.benchmarks.avgPagesPerSession.min,
			this.benchmarks.avgPagesPerSession.max
		)

		const timeScore = this.normalize(
			metrics.avgEngagementTimeSeconds,
			this.benchmarks.avgEngagementTimeSeconds.min,
			this.benchmarks.avgEngagementTimeSeconds.max
		)

		const pdvScore = this.normalize(
			metrics.productDetailViewRate,
			this.benchmarks.productDetailViewRate.min,
			this.benchmarks.productDetailViewRate.max
		)

		const atcScore = this.normalize(
			metrics.addToCartRate,
			this.benchmarks.addToCartRate.min,
			this.benchmarks.addToCartRate.max
		)

		const checkoutScore = this.normalize(
			metrics.checkoutCompletionRate,
			this.benchmarks.checkoutCompletionRate.min,
			this.benchmarks.checkoutCompletionRate.max
		)

		const purchaseScore = this.normalize(
			metrics.purchaseConversionRate,
			this.benchmarks.purchaseConversionRate.min,
			this.benchmarks.purchaseConversionRate.max
		)

		const rpsScore = this.normalize(
			metrics.revenuePerSession,
			this.benchmarks.revenuePerSession.min,
			this.benchmarks.revenuePerSession.max
		)

		const aovScore = this.normalize(
			metrics.averageOrderValue,
			this.benchmarks.averageOrderValue.min,
			this.benchmarks.averageOrderValue.max
		)

		const engagement = (pagesScore + timeScore + pdvScore) / 3.0
		const conversion = (atcScore + checkoutScore + purchaseScore) / 3.0
		const value = (rpsScore + aovScore) / 2.0

		return { engagement, conversion, value }
	}
}
