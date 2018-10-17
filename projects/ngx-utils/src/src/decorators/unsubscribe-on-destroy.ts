import {OnDestroy} from '@angular/core';
import {SubscriptionLike} from 'rxjs';


const UNSUBSCRIBE_ON_DESTROY = Symbol('unsubscribe-on-destroy');

function unsubscribe(obj: SubscriptionLike): void {
  if (typeof obj.unsubscribe === 'function') {
    obj.unsubscribe();
  }
}

function customOnDestroy(original: () => void): () => void {
  return function (this: OnDestroy) {
    const subs = this[UNSUBSCRIBE_ON_DESTROY] as ((string | symbol)[]);

    if (subs) {
      subs.forEach(s => {
        try {
          if (this[s]) {
            if (this[s] instanceof Array) {
              for (const sub of this[s]) {
                unsubscribe(sub);
              }
            } else {
              unsubscribe(this[s]);
            }
          }
        } catch (e) {
          console.error(`Error during field unsubscription: '${s.toString()}'`, this, e);
        }
      });
    }

    if (typeof original === 'function') {
      original.apply(this);
    }
  };
}

export function UnsubscribeOnDestroy(): PropertyDecorator {
  return (target: OnDestroy & { [UNSUBSCRIBE_ON_DESTROY]: (string | symbol)[] }, fieldName: string | symbol) => {
    if (!(UNSUBSCRIBE_ON_DESTROY in target)) {
      target[UNSUBSCRIBE_ON_DESTROY] = [];
      target.ngOnDestroy = customOnDestroy(target.ngOnDestroy);
    }

    target[UNSUBSCRIBE_ON_DESTROY].push(fieldName);
  };
}
