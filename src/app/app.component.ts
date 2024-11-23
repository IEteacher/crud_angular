import { afterNextRender, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductModel } from './model/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crud_angular';

  productForm:FormGroup = new FormGroup({});
  productObj: ProductModel = new ProductModel();
  productList: ProductModel[] = [];

  constructor(){
    this.createForm();
       
    afterNextRender(() => {
    const oldData = localStorage.getItem("ProData");
    if (oldData!=null){
      const parseData = JSON.parse(oldData);
      this.productList = parseData;
   }
    });
  }

  createForm()
  {
    //Inicializamos cada componente del formulario 
    this.productForm = new FormGroup({
      id: new FormControl(this.productObj.id, [Validators.required]),
      description: new FormControl(this.productObj.description, [Validators.required]),
      price: new FormControl(this.productObj.price, [Validators.required, Validators.minLength(3)])
    }) 
  }

  onSave(){
    //debugger;
    const oldData = localStorage.getItem("ProData");
    if (oldData!=null){
      const parseData = JSON.parse(oldData);
      this.productForm.controls['id'].setValue(parseData.length+1);
      this.productList.unshift(this.productForm.value);
    }
    else
    {
      this.productList.unshift(this.productForm.value);
    }
    localStorage.setItem("ProData", JSON.stringify(this.productList))
    this.reset();
  }


  onEdit(item: ProductModel)
  {
    this.productObj = item;
    this.createForm()
  }

  onUpdate(){
    const record = this.productList.find(m=>m.id == this.productForm.controls['id'].value);
    if(record != undefined){
      record.description = this.productForm.controls['description'].value;
      record.price = this.productForm.controls['price'].value;
    }
    localStorage.setItem("ProData", JSON.stringify(this.productList))
    this.productObj = new ProductModel;
    this.createForm();
  }

  onDelete(id:number){
    const isDelete = confirm("Estas seguro que deseas borrar?");
    if(isDelete){
      const index = this.productList.findIndex(m=>m.id == id);
      this.productList.splice(index,1);
      localStorage.setItem("ProData", JSON.stringify(this.productList))
    }
  }

  reset(){
    this.productObj = new ProductModel;
    this.createForm();
  }
}
