// components/TicketPDFGenerator.tsx
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CartItem {
  card: any;
  quantity: number;
}

interface TicketPDFGeneratorProps {
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  userProfile: {
    nombres: string;
    apellidos: string;
    idUsuario: number;
  } | null;
}

export const TicketPDFGenerator = {
  generateTicket: async ({ cartItems, totalPrice, totalItems, userProfile }: TicketPDFGeneratorProps) => {
    // Crear elemento HTML para el ticket
    const ticketElement = document.createElement('div');
    ticketElement.style.cssText = `
      width: 300px;
      padding: 20px;
      background: white;
      color: black;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      position: fixed;
      left: -1000px;
      top: -1000px;
    `;

    // Fecha y hora actual
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');

    // Contenido del ticket
    ticketElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 15px;">
        <h2 style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold;">KAZOKU GAMES</h2>
        <p style="margin: 0; font-size: 10px;">Tienda Especializada en Magic: The Gathering</p>
        <p style="margin: 5px 0; font-size: 9px;">www.kazokugames.com</p>
      </div>
      
      <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 8px 0; margin: 10px 0;">
        <div style="display: flex; justify-content: space-between;">
          <span>Fecha:</span>
          <span>${fecha}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Hora:</span>
          <span>${hora}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Ticket #:</span>
          <span>${Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
      </div>

      <div style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span><strong>Cliente:</strong></span>
          <span>${userProfile ? `${userProfile.nombres} ${userProfile.apellidos}` : 'Invitado'}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span><strong>ID Cliente:</strong></span>
          <span>${userProfile ? `CLI-${userProfile.idUsuario.toString().padStart(6, '0')}` : 'N/A'}</span>
        </div>
      </div>

      <div style="border-top: 1px dashed #000; padding: 8px 0; margin: 10px 0;">
        <div style="text-align: center; font-weight: bold; margin-bottom: 8px;">DETALLE DE COMPRA</div>
        
        ${cartItems.map(item => {
          const cardName = item.card.name.length > 20 
            ? item.card.name.substring(0, 20) + '...' 
            : item.card.name;
          
          const price = parseFloat(
            item.card.prices?.usd ||
            item.card.prices?.usd_foil ||
            item.card.prices?.eur ||
            '0'
          );
          
          const itemTotal = price * item.quantity;
          
          return `
            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between;">
                <span>${cardName}</span>
                <span>$${price.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px;">
                <span>Cant: ${item.quantity}</span>
                <span>Sub: $${itemTotal.toFixed(2)}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="border-top: 2px solid #000; padding: 10px 0; margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total Items:</span>
          <span>${totalItems}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
          <span>TOTAL A PAGAR:</span>
          <span>$${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div style="border-top: 1px dashed #000; padding: 10px 0; margin: 10px 0; text-align: center;">
        <p style="margin: 5px 0; font-size: 9px;">
          <strong>¡Gracias por su compra!</strong>
        </p>
        <p style="margin: 5px 0; font-size: 8px;">
          Para reclamos o consultas contacte a:<br/>
          soporte@kazokugames.com
        </p>
        <p style="margin: 5px 0; font-size: 8px;">
          Ticket generado electrónicamente
        </p>
      </div>
    `;

    // Agregar al documento temporalmente
    document.body.appendChild(ticketElement);

    try {
      // Convertir a canvas y luego a PDF
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: ticketElement.offsetWidth,
        height: ticketElement.offsetHeight,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [ticketElement.offsetWidth, ticketElement.offsetHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, ticketElement.offsetWidth, ticketElement.offsetHeight);
      
      // Generar nombre del archivo
      const fileName = `ticket_kazoku_${fecha.replace(/\//g, '-')}_${hora.replace(/:/g, '-')}.pdf`;
      
      // Descargar PDF
      pdf.save(fileName);

      return true;
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw new Error('No se pudo generar el ticket');
    } finally {
      // Limpiar elemento temporal
      document.body.removeChild(ticketElement);
    }
  }
};