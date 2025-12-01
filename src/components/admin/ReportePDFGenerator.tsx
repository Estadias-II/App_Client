import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportePDFData {
  estadisticasGenerales: {
    totalCartas: number;
    cartasActivas: number;
    cartasInactivas: number;
    cartasStockBajo: number;
    totalPedidos: number;
    pedidosPendientes: number;
    pedidosCompletados: number;
    ingresosTotales: number;
    totalCotizaciones: number;
    cotizacionesPendientes: number;
    cotizacionesCompletadas: number;
  };
  cartasStockBajo: Array<{
    nombreCarta: string;
    stockLocal: number;
    estadoStock: string;
  }>;
  estadoPedidos: {
    pendiente: number;
    confirmado: number;
    en_proceso: number;
    completado: number;
    cancelado: number;
  };
  periodo: string;
  fechaGeneracion: string;
}

export const ReportePDFGenerator = {
  generateReport: async (data: ReportePDFData) => {
    const reporteElement = document.createElement('div');
    reporteElement.style.cssText = `
      width: 800px;
      padding: 40px;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
      color: white;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      position: fixed;
      left: -10000px;
      top: -10000px;
    `;

    const { estadisticasGenerales, cartasStockBajo, estadoPedidos, periodo, fechaGeneracion } = data;

    reporteElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px;">
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold; color: #f59e0b; font-family: 'Orbitron', sans-serif;">
          KAZOKU GAMES
        </h1>
        <h2 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 300;">Reporte de Estadísticas</h2>
        <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 14px;">
          Período: ${periodo.toUpperCase()} | Generado: ${fechaGeneracion}
        </p>
      </div>

      <!-- Estadísticas Principales -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #f59e0b; font-size: 20px; margin-bottom: 20px; border-left: 4px solid #f59e0b; padding-left: 10px;">
          ESTADÍSTICAS PRINCIPALES
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; border-radius: 10px;">
            <div style="font-size: 12px; color: #dbeafe; margin-bottom: 5px;">INVENTARIO</div>
            <div style="font-size: 28px; font-weight: bold;">${estadisticasGenerales.totalCartas}</div>
            <div style="font-size: 12px; color: #dbeafe;">
              ${estadisticasGenerales.cartasActivas} activas • ${estadisticasGenerales.cartasStockBajo} stock bajo
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 20px; border-radius: 10px;">
            <div style="font-size: 12px; color: #d1fae5; margin-bottom: 5px;">INGRESOS TOTALES</div>
            <div style="font-size: 28px; font-weight: bold;">$${estadisticasGenerales.ingresosTotales.toFixed(2)}</div>
            <div style="font-size: 12px; color: #d1fae5;">
              ${estadisticasGenerales.pedidosCompletados} pedidos completados
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 20px; border-radius: 10px;">
            <div style="font-size: 12px; color: #ede9fe; margin-bottom: 5px;">PEDIDOS</div>
            <div style="font-size: 28px; font-weight: bold;">${estadisticasGenerales.totalPedidos}</div>
            <div style="font-size: 12px; color: #ede9fe;">
              ${estadisticasGenerales.pedidosPendientes} pendientes
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 10px;">
            <div style="font-size: 12px; color: #fef3c7; margin-bottom: 5px;">COTIZACIONES</div>
            <div style="font-size: 28px; font-weight: bold;">${estadisticasGenerales.totalCotizaciones}</div>
            <div style="font-size: 12px; color: #fef3c7;">
              ${estadisticasGenerales.cotizacionesCompletadas} completadas
            </div>
          </div>
        </div>
      </div>

      <!-- Cartas con Stock Bajo -->
      ${cartasStockBajo.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #ef4444; font-size: 20px; margin-bottom: 15px; border-left: 4px solid #ef4444; padding-left: 10px;">
          CARTAS CON STOCK BAJO
        </h3>
        <div style="background: #1f2937; border-radius: 8px; padding: 15px;">
          ${cartasStockBajo.map((carta, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; ${index < cartasStockBajo.length - 1 ? 'border-bottom: 1px solid #374151;' : ''}">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${carta.estadoStock === 'bajo' ? '#ef4444' : '#f59e0b'};"></div>
                <span style="color: white; font-weight: 500;">${carta.nombreCarta}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: #9ca3af;">Stock: ${carta.stockLocal}</span>
                <span style="background: ${carta.estadoStock === 'bajo' ? '#ef4444' : '#f59e0b'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">
                  ${carta.estadoStock.toUpperCase()}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Estado de Pedidos -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #3b82f6; font-size: 20px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px;">
          ESTADO DE PEDIDOS
        </h3>
        <div style="background: #1f2937; border-radius: 8px; padding: 20px;">
          ${Object.entries(estadoPedidos).map(([estado, cantidad]) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 5px;">
                <span style="color: white; text-transform: capitalize; font-weight: 500;">${estado.replace('_', ' ')}</span>
                <span style="color: #f59e0b; font-weight: bold;">${cantidad}</span>
              </div>
              <div style="width: 100%; height: 8px; background: #374151; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; background: ${
                  estado === 'completado' ? '#10b981' :
                  estado === 'en_proceso' ? '#3b82f6' :
                  estado === 'confirmado' ? '#f59e0b' :
                  estado === 'pendiente' ? '#f97316' :
                  '#ef4444'
                }; width: ${(cantidad / Math.max(1, estadisticasGenerales.totalPedidos)) * 100}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #374151; color: #9ca3af; font-size: 12px;">
        <p>Reporte generado automáticamente por el Sistema de Gestión Kazoku Games</p>
        <p>www.kazokugames.com | soporte@kazokugames.com</p>
      </div>
    `;

    document.body.appendChild(reporteElement);

    try {
      const canvas = await html2canvas(reporteElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: reporteElement.offsetWidth,
        height: reporteElement.offsetHeight,
        backgroundColor: '#0f0f0f'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [reporteElement.offsetWidth, reporteElement.offsetHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, reporteElement.offsetWidth, reporteElement.offsetHeight);

      const fileName = `reporte_kazoku_${data.fechaGeneracion.replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);

      return true;
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw new Error('No se pudo generar el reporte');
    } finally {
      document.body.removeChild(reporteElement);
    }
  }
};
