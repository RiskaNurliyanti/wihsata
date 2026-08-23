import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { AiPlannerOutput } from '@/types/database.types';

/**
 * Template PDF itinerary — dirender server-side (lihat api/trips/pdf/route.ts).
 * Warna disamakan dengan brand Wihsata (indigo) dan menampilkan foto destinasi
 * bila tersedia (item.image_url), supaya hasil unduhan terlihat rapi & menarik,
 * bukan sekadar teks polos.
 */

const COLORS = {
  primary: '#4f46e5',
  primaryDark: '#3730a3',
  text: '#1e1b2e',
  muted: '#6b7280',
  border: '#e5e7eb',
  bgMuted: '#f5f5f7',
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: COLORS.text, fontFamily: 'Helvetica' },
  headerBand: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
    color: '#ffffff',
  },
  brand: { fontSize: 10, marginBottom: 6, opacity: 0.85, letterSpacing: 1 },
  title: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  summary: { fontSize: 10, lineHeight: 1.4, opacity: 0.95 },
  metaRow: { flexDirection: 'row', marginTop: 10, gap: 14 },
  metaBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 9,
  },
  dayHeader: {
    backgroundColor: COLORS.bgMuted,
    borderRadius: 6,
    padding: 8,
    marginTop: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.primaryDark },
  daySubtotal: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.primary },
  itemRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
    gap: 10,
  },
  itemImage: { width: 48, height: 48, borderRadius: 6, objectFit: 'cover' },
  itemImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.bgMuted,
  },
  itemTime: { width: 40, fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.primary, paddingTop: 2 },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  itemActivity: { fontSize: 9, color: COLORS.muted, lineHeight: 1.4 },
  itemNotes: { fontSize: 8.5, color: COLORS.muted, fontStyle: 'italic', marginTop: 2 },
  itemCost: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.primaryDark, marginTop: 3 },
  recommendationsBox: {
    marginTop: 18,
    padding: 12,
    backgroundColor: COLORS.bgMuted,
    borderRadius: 8,
  },
  recommendationsTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.primaryDark },
  recommendationItem: { fontSize: 9, color: COLORS.text, marginBottom: 3, lineHeight: 1.4 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    fontSize: 8,
    color: COLORS.muted,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
});

function formatRupiahPdf(value: number): string {
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

interface ItineraryPdfDocumentProps {
  title: string;
  itinerary: AiPlannerOutput;
  travelersCount?: number;
}

export function ItineraryPdfDocument({ title, itinerary, travelersCount }: ItineraryPdfDocumentProps) {
  return (
    <Document title={title} author="Wihsata">
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerBand}>
          <Text style={styles.brand}>WIHSATA — AI TRIP ITINERARY</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary}>{itinerary.summary ?? 'Itinerary perjalanan Anda.'}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaBadge}>Total Estimasi: {formatRupiahPdf(itinerary.total_estimated_cost ?? 0)}</Text>
            {travelersCount ? <Text style={styles.metaBadge}>{travelersCount} Traveler</Text> : null}
            <Text style={styles.metaBadge}>{(itinerary.days ?? []).length} Hari Perjalanan</Text>
          </View>
        </View>

        {(itinerary.days ?? []).map((day) => (
          <View key={day.day} wrap={false}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                Hari {day.day}
                {day.date ? ` — ${day.date}` : ''}
              </Text>
              <Text style={styles.daySubtotal}>{formatRupiahPdf(day.subtotal)}</Text>
            </View>

            {(day.items ?? []).map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={styles.itemTime}>{item.time}</Text>
                {item.image_url ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={item.image_url} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemImagePlaceholder} />
                )}
                <View style={styles.itemBody}>
                  <Text style={styles.itemTitle}>{item.destination_name}</Text>
                  <Text style={styles.itemActivity}>{item.activity}</Text>
                  {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
                  <Text style={styles.itemCost}>{formatRupiahPdf(item.estimated_cost)}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {(itinerary.recommendations ?? []).length > 0 && (
          <View style={styles.recommendationsBox} wrap={false}>
            <Text style={styles.recommendationsTitle}>Rekomendasi Tambahan</Text>
            {(itinerary.recommendations ?? []).map((rec, i) => (
              <Text key={i} style={styles.recommendationItem}>
                • {rec}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.footer} fixed>
          Dibuat otomatis oleh Wihsata AI Trip Planner — wihsata.com
        </Text>
      </Page>
    </Document>
  );
}
