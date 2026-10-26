import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-are-you-sure-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './are-you-sure-dialog.html',
  styleUrl: './are-you-sure-dialog.css',
})
export class AreYouSureDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    public dialogRef: MatDialogRef<AreYouSureDialogComponent>,
  ) {}

  accept(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
