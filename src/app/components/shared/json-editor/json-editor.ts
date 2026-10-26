import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Thin wrapper around the global JSONEditor build (loaded from the CDN in
// index.html), replacing the ngx-jsoneditor module the 2019 app used.
@Component({
  selector: 'json-editor',
  template: '<div #holder class="json-editor-holder"></div>',
  styles: [
    `
      .json-editor-holder {
        min-height: 300px;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonEditorComponent),
      multi: true,
    },
  ],
})
export class JsonEditorComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  @Input() config: any = {};
  @ViewChild('holder', { static: true }) holder!: ElementRef<HTMLDivElement>;

  private editor: any = null;
  private value: any = null;
  private disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.editor = new JSONEditor(this.holder.nativeElement, {
      ...this.config,
      onChange: () => {
        if (this.editor) {
          this.onChange(this.editor.getValue());
        }
      },
    }, this.value);
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editor = null;
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.editor) {
      this.editor.setValue(value);
    }
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    if (this.editor) {
      this.editor.disable();
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
