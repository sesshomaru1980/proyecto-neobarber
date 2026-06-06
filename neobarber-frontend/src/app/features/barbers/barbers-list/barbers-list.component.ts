import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-barbers-list',
  templateUrl: './barbers-list.component.html',
  styleUrls: ['./barbers-list.component.css']
})
export class BarbersListComponent implements OnInit {

  // ============================================
  // LISTA
  // ============================================

  barbers: any[] = [];

  // ============================================
  // MENSAJES
  // ============================================

  error = '';
  msg = '';
showSuccessModal = false;

showErrorModal = false;

successMessage = '';

errorMessage = '';
  // ============================================
  // ADMIN
  // ============================================

  isAdmin = false;

  // ============================================
  // EDICIÓN
  // ============================================

  isEditing = false;

  editingUserId = '';

  // ============================================
  // IMAGEN
  // ============================================

  selectedFile: File | null = null;

  uploading = false;

  // ============================================
  // FORMULARIO
  // ============================================

  form = {
    fullName: '',
    email: '',
    password: '',
    bio: '',
    imageUrl: ''
  };

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

  // ============================================
  // CARGAR BARBEROS
  // ============================================

  load(): void {

    this.api
      .get<any[]>('/api/barbers')
      .subscribe({

        next: (d) => {

          this.barbers =
            d || [];
        },

       error: (e) => {

  console.error(e);

  this.errorMessage =
    'No se pudieron cargar los barberos.';

  this.showErrorModal =
    true;
}
      });
  }

  // ============================================
  // HELPERS
  // ============================================

  getBarberUserId(
    barber: any
  ): string {

    return (

      barber?.userId?._id ||

      barber?.userId ||

      barber?._id ||

      ''
    );
  }

  getBarberName(
    barber: any
  ): string {

    return (

      barber?.userId?.fullName ||

      barber?.fullName ||

      'Barbero'
    );
  }

  getBarberEmail(
    barber: any
  ): string {

    return (

      barber?.userId?.email ||

      barber?.email ||

      ''
    );
  }

  isBarberActive(
    barber: any
  ): boolean {

    return (

      barber?.userId?.isActive ??

      barber?.isActive ??

      true
    );
  }

  getBarberImage(
    barber: any
  ): string {

    return barber?.imageUrl || '';
  }

  hasImage(
    url: string
  ): boolean {

    return !!url;
  }

  // ============================================
  // SUBIR FOTO
  // ============================================

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

      this.form.imageUrl =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  uploadImage(
    callback: (
      imageUrl: string
    ) => void
  ): void {

    if (!this.selectedFile) {

      callback(
        this.form.imageUrl
      );

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

    this.http.post<any>(
      'http://localhost:3000/api/upload/image',
      formData
    )
    .subscribe({

      next: (res) => {

        this.uploading =
          false;

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

this.showErrorModal =
  true;
      }
    });
  }

  // ============================================
  // LIMPIAR
  // ============================================

  resetForm(): void {

    this.isEditing =
      false;

    this.editingUserId =
      '';

    this.selectedFile =
      null;

    this.form = {

      fullName: '',

      email: '',

      password: '',

      bio: '',

      imageUrl: ''
    };
  }

  // ============================================
  // EDITAR
  // ============================================

  edit(
    barber: any
  ): void {

    this.isEditing =
      true;

    this.editingUserId =
      this.getBarberUserId(
        barber
      );

    this.form.fullName =
      this.getBarberName(
        barber
      );

    this.form.email =
      this.getBarberEmail(
        barber
      );

    this.form.password =
      '';

    this.form.bio =
      barber?.bio || '';

    this.form.imageUrl =
      barber?.imageUrl || '';
  }

  // ============================================
  // GUARDAR
  // ============================================

  save(): void {

    this.successMessage = '';

this.errorMessage = '';

this.showSuccessModal = false;

this.showErrorModal = false;

    if (
  !this.form.fullName.trim()
) {

  this.errorMessage =
    'Debes ingresar el nombre del barbero.';

  this.showErrorModal =
    true;

  return;
}

   if (
  !this.form.email.trim()
) {

  this.errorMessage =
    'Debes ingresar un correo electrónico.';

  this.showErrorModal =
    true;

  return;
}

    this.uploadImage(

      (uploadedImageUrl) => {

        // ======================
        // CREAR
        // ======================

        if (!this.isEditing) {

          if (
            !this.form.password.trim()
          ) {

           this.errorMessage =
  'Debes ingresar una contraseña.';

this.showErrorModal =
  true;
            return;
          }
if (!this.selectedFile) {

  this.errorMessage =
    'Debes seleccionar una fotografía del barbero.';

  this.showErrorModal = true;

  return;
}
          const payload = {

            fullName:
              this.form.fullName.trim(),

            email:
              this.form.email.trim(),

            password:
              this.form.password.trim(),

            bio:
              this.form.bio.trim(),

            imageUrl:
              uploadedImageUrl,

            weeklyAvailability: []
          };

          this.api.post(
            '/api/barbers/admin-create',
            payload
          )
          .subscribe({

           next: () => {

  this.successMessage =
    'Barbero creado correctamente ✅';

  this.showSuccessModal =
    true;

  this.resetForm();

  this.load();
},

           error: (e) => {

  this.errorMessage =

    e?.error?.error ||

    e?.error?.message ||

    'No se pudo crear el barbero.';

  this.showErrorModal =
    true;
}
          });

          return;
        }

        // ======================
        // EDITAR
        // ======================

        const updatePayload = {

          userId:
            this.editingUserId,

          fullName:
            this.form.fullName.trim(),

          email:
            this.form.email.trim(),

          bio:
            this.form.bio.trim(),

          imageUrl:
            uploadedImageUrl,

          weeklyAvailability: []
        };

        this.api.put(
          '/api/barbers/admin-update',
          updatePayload
        )
        .subscribe({

          next: () => {

            this.successMessage =
  'Barbero actualizado correctamente ✅';

this.showSuccessModal =
  true;

            this.resetForm();

            this.load();
          },

          error: (e) => {

           this.errorMessage =

  e?.error?.error ||

  e?.error?.message ||

  'No se pudo actualizar el barbero.';

this.showErrorModal =
  true;
          }
        });
      }
    );
  }

  // ============================================
  // ACTIVAR / DESACTIVAR
  // ============================================

  toggleActive(
    barber: any
  ): void {

    const userId =
      this.getBarberUserId(
        barber
      );

    const nextActive =
      !this.isBarberActive(
        barber
      );

    this.api.patch(

      `/api/barbers/${userId}/active`,

      {
        isActive:
          nextActive
      }

    ).subscribe({

      next: () => {

        this.load();
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