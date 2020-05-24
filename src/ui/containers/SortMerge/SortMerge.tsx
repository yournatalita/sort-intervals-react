import React, { useState } from 'react';
import classNames from 'classnames';
import { getErrorMessage } from 'src/helpers/errorMessages';

import Button from '../../elements/Button/Button';
import Input from '../../elements/Input/Input';

import styles from './SortMerge.module.scss';

import { TIntervals, SortMergeState } from './SortMerge.d';

import { ReactComponent as IconCalc } from '../../../assets/icons/calc.svg';
import { ReactComponent as IconClean } from '../../../assets/icons/clean.svg';

const getIntervals = (value: string): TIntervals => {
  return value.split(',');
};

/**
 * Преобразует строку-интервал в массив из двух валидных целых значений
 * @param value {string} - интервал
 * @return {number[] | null} - массив из валидных целых значений или null
 */
const parseStringValues = (value: string): number[] | null => {
  const splitValue = value.match(/^(([-]?\d+)-([-]?\d+))$/);

  return splitValue && splitValue[2] && splitValue[3]
    ? [Number(splitValue[2]), Number(splitValue[3])]
    : null;
};

/**
 * Проверяет валидность интервала
 * @param value - интервал
 * @return { valid: boolean; error: string } - статус валидности интервала
 */
const isValid = (value: string): { valid: boolean; error: string } => {
  const pair = parseStringValues(value);

  if (!pair || (!pair[0] && pair[0] !== 0) || (!pair[1] && pair[1] !== 0)) {
    return {
      valid: false,
      error: getErrorMessage.invalidBoundaries(value),
    };
  }

  if (pair[0] > pair[1]) {
    return {
      valid: false,
      error: getErrorMessage.invalidBoundariesSizes(value),
    };
  }

  return {
    valid: true,
    error: '',
  };
};

/**
 * Соединяет пересекающиеся интервалы
 * @param sorted - сортированый массив
 * @return {merged: TIntervals; error: string; } - отсортированные и объединённые интервалы
 */
const mergeIntervals = (sorted: TIntervals): { merged: TIntervals; error: string } => {
  // индекс последнего преобразованного значения
  let lastMergedIndex = 0;
  // по умолчанию первый элемент нового массива - первый сортированного
  const mergedArray = [sorted[lastMergedIndex]];
  let error = '';

  if (sorted) {
    sorted.forEach((interval) => {
      const values = parseStringValues(interval);
      const valuesMerged = parseStringValues(mergedArray[lastMergedIndex]);

      if (values && valuesMerged) {
        const [start, end] = values;
        const [mergedStart, mergedEnd] = valuesMerged;

        // если интервалы пересекаются, то соединяем их
        if (mergedEnd >= start) {
          mergedArray[lastMergedIndex] = `${Math.min(mergedStart, start)}-${Math.max(
            mergedEnd,
            end
          )}`;
        } else {
          // иначе записываем новый интевал
          lastMergedIndex++;
          mergedArray[lastMergedIndex] = interval;
        }
      } else {
        error = getErrorMessage.invalidBoundaries();
      }
    });
  }

  return {
    merged: mergedArray,
    error,
  };
};

/**
 * Сортирует интервалы по стартовому значению в порядке возрастания
 * @param intervals - массив интервалов
 * @return { sorted: TIntervals | null; error: string; } - массив отсортированных интервалов
 */
const sortIntervals = (
  intervals: TIntervals
): {
  sorted: TIntervals | null;
  error: string;
} => {
  let error = '';

  // sort не вызывает коллбек-функцию для массивов с 1 элементом,
  // проверяем валидность тут
  // можно не сортировать
  if (intervals.length === 1) {
    const validated = isValid(intervals[0]);

    return {
      sorted: validated.valid ? intervals : null,
      error: validated.error,
    };
  }

  const sorted = intervals.sort((first, second) => {
    const firstValidated = isValid(first);
    const secondValidated = isValid(second);

    if (firstValidated.valid && secondValidated.valid) {
      const valuesFirst = parseStringValues(first);
      const valuesSecond = parseStringValues(second);

      if (valuesFirst && valuesSecond) {
        const startFirst = valuesFirst[0];
        const startSecond = valuesSecond[0];

        if (startFirst > startSecond) return 1;
        if (startFirst < startSecond) return -1;

        return 0;
      } else {
        error = firstValidated.error || secondValidated.error;
      }
    }
    error = firstValidated.error || secondValidated.error;
    return 0;
  });

  return {
    sorted,
    error,
  };
};

/**
 * Сортирует и соединяет интервалы
 * @param value - значение из поля
 * @param stateActions - объект для обновления стейта компонента
 */
const sortAndMergeIntervals = (value: string, stateActions: SortMergeState): void => {
  const { setError, setIntervals } = stateActions;
  const intervals = getIntervals(value);

  if (!intervals || !(intervals instanceof Array)) {
    setError(getErrorMessage.notArray());
  } else if (intervals.length < 1) {
    setError(getErrorMessage.arrayLength());
  } else if (intervals.length === 1 && intervals[0] === '') {
    setError(getErrorMessage.arrayLength());
  } else {
    const sortedData = sortIntervals(intervals);

    if (!sortedData.error && sortedData.sorted) {
      const mergedData = mergeIntervals(sortedData.sorted);
      setIntervals(mergedData.merged);
      setError(mergedData.error);
    } else {
      setError(sortedData.error);
    }
  }
};

const SortMerge = (): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [intervals, setIntervals] = useState<TIntervals | null>(null);

  return (
    <div className={styles.root}>
      <div className={classNames(styles.container, 'container')}>
        <div className={styles.fieldContainer}>
          <Input
            type={'text'}
            name={'field'}
            value={inputValue}
            placeholder={'1-1,12-44'}
            label={'Enter comma separated list of intervals'}
            onChange={(e): void => {
              setInputValue(e.target.value);
            }}
            errorText={error}
          />
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.button}>
            <Button
              themes={['blue']}
              onClick={(): void => {
                sortAndMergeIntervals(inputValue, { setError, setIntervals });
              }}
            >
              <span className={styles.calc}>
                <IconCalc />
              </span>
              Merge and Sort
            </Button>
          </div>
          <div className={styles.button}>
            <Button
              themes={['white']}
              onClick={(): void => {
                setInputValue('');
                setError('');
                setIntervals(null);
              }}
            >
              <span className={styles.clean}>
                <IconClean />
              </span>
              Clear
            </Button>
          </div>
        </div>
      </div>
      {intervals && !error && (
        <div className={styles.result}>
          <h5>Result</h5>
          <ul className={styles.list}>
            {intervals.map((interval, index) => {
              const values = parseStringValues(interval);
              if (values) {
                return (
                  <li className={styles.item} key={`${interval}${index}`}>
                    <span className={styles.intervalItem}>{values[0]}</span>-
                    <span className={styles.intervalItem}>{values[1]}</span>
                  </li>
                );
              }
              return '';
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortMerge;
