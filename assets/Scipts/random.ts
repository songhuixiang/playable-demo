export namespace random {
    /**
     * Get a random integer in [ min, max ]
     * @param min [min=0] - Lower bound (integer, inclusive)
     * @param max [max=1] - Upper bound (integer, inclusive)
     * @returns min <= random integer <= max
     */
    export function integer(min: number = 0, max: number = 1) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Get a random floating point number in [ min, max )
     * @param min [min=0] - Lower bound (float, inclusive)
     * @param max [max=1] - Upper bound (float, exclusive)
     * @param fixed By default it will return a fixed number of at most 4 digits after the decimal.
     * @returns min <= random float < max
     */
    export function float(min: number = 0, max: number = 1, fixed: number = 4) {
        return Number((Math.random() * (max - min) + min).toFixed(fixed));
    }

    /**
     * Get a random boolean value
     * @param percent The default percent of success (returning true) is 50%.
     * @returns
     */
    export function boolean(percent: number = 50) {
        return Math.random() * 100 < percent;
    }

    /**
     * Given an array, pick a random element and return it
     * @param arr
     * @param count
     * @returns
     */
    export function pick<T>(arr: Array<T>): T;
    export function pick<T>(arr: Array<T>, count: number): Array<T>;
    export function pick<T>(arr: Array<T>, count?: number): T | Array<T> {
        if (arr.length === 0) {
            throw new RangeError("pick: Cannot pick() from an empty array");
        }
        if (count === undefined) {
            return arr[random.integer(0, arr.length - 1)];
        } else {
            return random.shuffle(arr).slice(0, count);
        }
    }

    /**
     * 洗牌: Given an array, scramble the order and return it.
     * @param arr
     * @returns
     */
    export function shuffle<T>(arr: Array<T>): Array<T> {
        let new_array: Array<T> = [],
            length = arr.length,
            source_indexes = Array.apply(null, Array(length)).map((_, i) => i),
            last_source_index = length - 1;

        for (let i = 0; i < length; i++) {
            let selected_source_index = random.integer(0, last_source_index);
            let j = source_indexes[selected_source_index];
            new_array[i] = arr[j];
            source_indexes[selected_source_index] = source_indexes[last_source_index];
            last_source_index -= 1;
        }

        return new_array;
    }

    /**
     * 权重随机: Returns a single item from an array with relative weighting of odds
     * @param arr
     * @param weights
     * @param trim
     * @returns
     */
    export function weighted<T>(arr: Array<T>, weights: Array<number>, trim: boolean = false): T {
        if (arr.length !== weights.length) {
            throw new RangeError("weighted:: Length of array and weights must match");
        }

        let sum: number = 0;
        let val: number;
        for (let index = 0; index < weights.length; ++index) {
            val = weights[index];
            if (val > 0) {
                sum += val;
            }
        }

        if (sum === 0) {
            throw new RangeError("weighted:: No valid entries in array weights");
        }

        let selected = Math.random() * sum;

        let total: number = 0;
        let lastGoodIdx: number = -1;
        let chosenIdx: number = 0;
        for (let index = 0; index < weights.length; ++index) {
            val = weights[index];
            total += val;
            if (val > 0) {
                if (selected <= total) {
                    chosenIdx = index;
                    break;
                }
                lastGoodIdx = index;
            }

            if (index === weights.length - 1) {
                chosenIdx = lastGoodIdx;
            }
        }

        let chosen = arr[chosenIdx];
        if (trim) {
            arr.splice(chosenIdx, 1);
            weights.splice(chosenIdx, 1);
        }

        return chosen;
    }

    /**
     * Generate Random Point in a Circle. Default is an Unit Circle
     * @param radius 1
     * @param x_center 0
     * @param y_center 0
     * @returns
     */
    export function inCircle(radius: number = 1, x_center: number = 0, y_center: number = 0) {
        let ang = Math.random() * 2 * Math.PI,
            hyp = Math.sqrt(Math.random()) * radius,
            adj = Math.cos(ang) * hyp,
            opp = Math.sin(ang) * hyp;
        return { x: x_center + adj, y: y_center + opp };
    }

    /**
     * Generate Random Point on a Circle. Default is an Unit Circle
     * @param radius 1
     * @param x_center 0
     * @param y_center 0
     * @returns
     */
    export function onCircle(radius: number = 1, x_center: number = 0, y_center: number = 0) {
        let ang = Math.random() * 2 * Math.PI,
            adj = Math.cos(ang) * radius,
            opp = Math.sin(ang) * radius;
        return { x: x_center + adj, y: y_center + opp };
    }

    let spare: number;
    let hasSpare: boolean = false;
    /**
     * 正态分布随机：默认情况下，均值为0，标准差为1，即标准正态分布。
     * @param mean 0
     * @param stdDev 1
     * @returns
     */
    export function normal(mean: number = 0, stdDev: number = 1) {
        if (hasSpare) {
            hasSpare = false;
            return spare * stdDev + mean;
        } else {
            let u, v, s;
            do {
                u = Math.random() * 2 - 1;
                v = Math.random() * 2 - 1;
                s = u * u + v * v;
            } while (s >= 1 || s === 0);
            s = Math.sqrt((-2.0 * Math.log(s)) / s);
            spare = v * s;
            hasSpare = true;
            return mean + stdDev * u * s;
        }
    }
}
