import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AreYouSureDialogComponent } from '../components/shared/are-you-sure-dialog/are-you-sure-dialog';

@Injectable({ providedIn: 'root' })
export class MacrosService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  areYouSureAction(
    text: string,
    errorText: string,
    action: () => Promise<any>,
    thenAction: () => void,
  ): void {
    const dialogRef = this.dialog.open(AreYouSureDialogComponent, {
      width: '400px',
      data: { text: text },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        action()
          .then(() => thenAction())
          .catch(err => this.snackBar.open(errorText + err.message, 'OK'));
      }
    });
  }

  directAction(
    errorText: string,
    action: () => Promise<any>,
    thenAction: () => void,
  ): void {
    this.directActionWithConfirmation('', errorText, action, thenAction);
  }

  directActionWithConfirmation(
    successText: string,
    errorText: string,
    action: () => Promise<any>,
    thenAction: () => void,
  ): void {
    action()
      .then(() => {
        if (successText) {
          this.snackBar.open(successText, '', { duration: 5000 });
        }
        thenAction();
      })
      .catch(err => this.snackBar.open(errorText + err.message, 'OK'));
  }

  directActionFull(
    errorText: string,
    action: () => Promise<any>,
    thenAction: (res: any) => void,
    catchAction: (err: any) => void,
  ): void {
    action()
      .then(res => thenAction(res))
      .catch(err => {
        catchAction(err);
        if (errorText) {
          this.snackBar.open(errorText + err.message, 'OK');
        }
      });
  }
}
