import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {

  services: any[] = [];

  isAdmin = false;

  name = '';
  description = '';
  durationMinutes = 30;
  price = 20000;
  imageUrl = '';

  selectedFile: File | null = null;

  uploading = false;

  editingId = '';
  editName = '';
  editDescription = '';
  editDurationMinutes = 30;
  editPrice = 20000;
  editImageUrl = '';
  editIsActive = true;

  msg = '';
  error = '';
showSuccessModal = false;

showErrorModal = false;

successMessage = '';

errorMessage = '';
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.isAdmin =
      this.auth.role() === 'Admin';

    this.load();
  }

  load(): void {

    this.api
      .get<any[]>('/api/services')
      .subscribe({

        next: (d) => {

          this.services =
            d || [];
        },

        error: () => {

  this.errorMessage =
    'No se pudieron cargar los servicios.';

  this.showErrorModal =
    true;
}
      });
  }

 create(): void {

  this.successMessage = '';

  this.errorMessage = '';

  this.showSuccessModal = false;

  this.showErrorModal = false;

  // ============================================
  // VALIDAR NOMBRE
  // ============================================

  if (!this.name.trim()) {

    this.errorMessage =
      'Debes ingresar el nombre del servicio.';

    this.showErrorModal = true;

    return;
  }

  // ============================================
  // VALIDAR DESCRIPCIÓN
  // ============================================

  if (!this.description.trim()) {

    this.errorMessage =
      'Debes ingresar una descripción del servicio.';

    this.showErrorModal = true;

    return;
  }

  // ============================================
  // VALIDAR DURACIÓN
  // ============================================

  if (this.durationMinutes <= 0) {

    this.errorMessage =
      'La duración debe ser mayor a cero minutos.';

    this.showErrorModal = true;

    return;
  }

  // ============================================
  // VALIDAR PRECIO
  // ============================================

  if (this.price <= 0) {

    this.errorMessage =
      'El precio debe ser mayor a cero.';

    this.showErrorModal = true;

    return;
  }
if (!this.selectedFile) {

  this.errorMessage =
    'Debes seleccionar una imagen para el servicio.';

  this.showErrorModal = true;

  return;
}
  // ============================================
  // CONTINUAR
  // ============================================

  this.uploadImage(

      (uploadedImageUrl) => {

        this.api.post(

          '/api/services',

          {
            name: this.name,
            description: this.description,
            durationMinutes: this.durationMinutes,
            price: this.price,
            imageUrl: uploadedImageUrl
          }

        ).subscribe({

          next: () => {

            this.successMessage =
  'Servicio creado correctamente ✅';

this.showSuccessModal =
  true; 

            this.name = '';
            this.description = '';
            this.durationMinutes = 30;
            this.price = 20000;
            this.imageUrl = '';
            this.selectedFile = null;

            this.load();
          },

          error: (e) => {

           this.errorMessage =
  'No se pudo crear el servicio';

this.showErrorModal =
  true;
          }
        });
      }
    );
  }

  startEdit(service: any): void {

    this.editingId =
      service._id;

    this.editName =
      service.name || '';

    this.editDescription =
      service.description || '';

    this.editDurationMinutes =
      service.durationMinutes || 30;

    this.editPrice =
      service.price || 0;

    this.editImageUrl =
      service.imageUrl || '';

    this.editIsActive =
      service.isActive !== false;
  }

  cancelEdit(): void {

    this.editingId = '';

    this.editName = '';

    this.editDescription = '';

    this.editDurationMinutes = 30;

    this.editPrice = 20000;

    this.editImageUrl = '';

    this.editIsActive = true;
  }

  update(): void {

    if (!this.editingId) {
      return;
    }

    this.api.put(

      `/api/services/${this.editingId}`,

      {
        name: this.editName,
        description: this.editDescription,
        durationMinutes: this.editDurationMinutes,
        price: this.editPrice,
        imageUrl: this.editImageUrl,
        isActive: this.editIsActive
      }

    ).subscribe({

     next: () => {

  this.successMessage =
    'Servicio actualizado correctamente ✅';

  this.showSuccessModal =
    true;

  this.cancelEdit();

  this.load();
},

     error: (e) => {

  this.errorMessage =

    e?.error?.error ||

    e?.error?.message ||

    'No se pudo actualizar.';

  this.showErrorModal = true;
}
    });
  }

  remove(id: string): void {

    if (
      !confirm(
        '¿Eliminar servicio?'
      )
    ) {
      return;
    }

    this.api
      .delete(
        `/api/services/${id}`
      )
      .subscribe({

        next: () => {

          this.load();
        }
      });
  }

  hasImage(
    url: string
  ): boolean {

    return !!url;
  }

 onFileSelected(
  event: any
): void {

  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  this.selectedFile =
    file;

  const reader =
    new FileReader();

  reader.onload = () => {

    this.imageUrl =
      reader.result as string;
  };

  reader.readAsDataURL(file);
}

uploadImage(
  callback: (
    imageUrl: string
  ) => void
): void {

  console.log(
    'ENTRÓ A uploadImage'
  );

  if (!this.selectedFile) {

    callback('');

    return;
  }

    const formData =
      new FormData();

    formData.append(
      'image',
      this.selectedFile
    );

    this.uploading =
      true;
console.log(
  'ENVIANDO IMAGEN',
  this.selectedFile
);
    this.http.post<any>(
      'http://localhost:3000/api/upload/image',
      formData
    )
    .subscribe({

      next: (res) => {

        this.uploading =
          false;

        console.log(
          'UPLOAD OK',
          res
        );

        callback(
          res.imageUrl
        );
      },

      error: (err) => {

        console.error(err);

        this.uploading =
          false;

        this.errorMessage =
  'No se pudo subir la imagen';

this.showErrorModal = true;
      }
    });
  }
  closeSuccessModal(): void {

  this.showSuccessModal = false;

  this.successMessage = '';
}

closeErrorModal(): void {

  this.showErrorModal = false;

  this.errorMessage = '';
}
}
