import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // ===============================
  // LAYOUT GERAL & SPLASH
  // ===============================
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1015',
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#A0A3BD',
  },

  // ===============================
  // CABEÇALHO / APPBAR
  // ===============================
  header: {
    backgroundColor: '#14161F',
    borderBottomWidth: 1,
    borderBottomColor: '#222533',
    elevation: 4,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },

  // ===============================
  // ABAS DE CATEGORIAS (PILLS)
  // ===============================
  tabsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#0F1015',
  },

  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#1C1F2B',
    borderWidth: 1,
    borderColor: '#2A2E40',
  },

  tabItemActive: {
    backgroundColor: '#F2A900',
    borderColor: '#F2A900',
  },

  tabText: {
    color: '#A0A3BD',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  tabTextActive: {
    color: '#0F1015',
    fontWeight: '800',
  },

  // ===============================
  // LISTA DE CARDS
  // ===============================
  cards: {
    flex: 1,
    backgroundColor: '#0F1015',
  },

  cardsContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 40,
  },

  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#181A24',
    borderWidth: 1,
    borderColor: '#262A3B',
    overflow: 'hidden',
    elevation: 4,
  },

  cardCover: {
    height: 190,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#222533',
  },

  cardBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 16, 21, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2A900',
  },

  cardBadgeText: {
    color: '#F2A900',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  cardContent: {
    padding: 14,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 4,
  },

  cardSubtitle: {
    color: '#A0A3BD',
    fontSize: 13,
    marginBottom: 6,
  },

  cardDescription: {
    color: '#8A8D9F',
    fontSize: 12,
    lineHeight: 18,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#202331',
  },

  // ===============================
  // TELA DE DETALHES
  // ===============================
  detalhesContainer: {
    flex: 1,
    backgroundColor: '#0F1015',
  },

  detalhesBanner: {
    width: '100%',
    height: 280,
    backgroundColor: '#202330',
  },

  detalhesHeaderOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detalhesIconButton: {
    backgroundColor: 'rgba(15, 16, 21, 0.7)',
    borderRadius: 24,
  },

  detalhesContent: {
    padding: 18,
  },

  detalhesCategoria: {
    alignSelf: 'flex-start',
    backgroundColor: '#262A3B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F2A900',
  },

  detalhesCategoriaText: {
    color: '#F2A900',
    fontSize: 12,
    fontWeight: '800',
  },

  detalhesTitulo: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 26,
    marginBottom: 6,
  },

  detalhesSubtitulo: {
    color: '#A0A3BD',
    fontSize: 15,
    marginBottom: 16,
  },

  detalhesSinopseBox: {
    backgroundColor: '#181A24',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262A3B',
    marginBottom: 24,
  },

  detalhesSinopseTitulo: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },

  detalhesSinopseTexto: {
    color: '#A0A3BD',
    fontSize: 14,
    lineHeight: 22,
  },

  // ===============================
  // LISTA DE EPISÓDIOS
  // ===============================
  episodiosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  episodiosTitulo: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },

  episodioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181A24',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262A3B',
    marginBottom: 10,
  },

  episodioNumeroBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#262A3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  episodioNumeroText: {
    color: '#F2A900',
    fontWeight: '800',
    fontSize: 15,
  },

  episodioInfo: {
    flex: 1,
  },

  episodioTitulo: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },

  episodioDuracao: {
    color: '#A0A3BD',
    fontSize: 12,
  },

  // ===============================
  // TELAS DE ACESSO / LOGIN / CADASTRO
  // ===============================
  authContainer: {
    flex: 1,
    backgroundColor: '#0F1015',
  },

  authContent: {
    padding: 24,
    justifyContent: 'center',
  },

  authTitulo: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 6,
  },

  authSubtitulo: {
    color: '#A0A3BD',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },

  authInput: {
    marginBottom: 16,
    backgroundColor: '#181A24',
  },

  authButtonPrimary: {
    marginTop: 10,
    marginBottom: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F2A900',
  },

  authButtonSecondary: {
    borderRadius: 10,
    borderColor: '#303448',
  },

  // ===============================
  // SELETOR DE PERFIL (CADASTRO)
  // ===============================
  perfilSelectorContainer: {
    marginBottom: 20,
  },

  perfilSelectorLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  perfilOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  perfilOptionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#181A24',
    borderWidth: 1.5,
    borderColor: '#2A2E40',
  },

  perfilOptionActive: {
    borderColor: '#F2A900',
    backgroundColor: '#262417',
  },

  perfilOptionText: {
    marginLeft: 6,
    color: '#A0A3BD',
    fontWeight: '700',
    fontSize: 13,
  },

  perfilOptionTextActive: {
    color: '#F2A900',
  },

  // ===============================
  // ACESSO INICIAL
  // ===============================
  acesso: {
    padding: 24,
    justifyContent: 'center',
  },

  acessoTitulo: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 26,
    marginBottom: 8,
  },

  acessoTexto: {
    color: '#A0A3BD',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 32,
  },

  acessoButton: {
    marginBottom: 14,
    borderRadius: 10,
    paddingVertical: 6,
  },

  // ===============================
  // LOGIN / CADASTRO COMPAT
  // ===============================
  loginContainer: {
    flex: 1,
    backgroundColor: '#0F1015',
  },
  loginContent: {
    padding: 24,
  },
  loginTitulo: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 26,
  },
  loginTexto: {
    color: '#A0A3BD',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 26,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#181A24',
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: '#F2A900',
  },

  cadastroContainer: {
    flex: 1,
    backgroundColor: '#0F1015',
  },
  cadastroContent: {
    padding: 24,
  },
  cadastroTitulo: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: 26,
  },
  cadastroTexto: {
    color: '#A0A3BD',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },
  cadastroButton: {
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: '#F2A900',
  },

  // ===============================
  // PAINEL DE ADMINISTRAÇÃO
  // ===============================
  adminHeaderStat: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
    backgroundColor: '#14161F',
    borderBottomWidth: 1,
    borderBottomColor: '#222533',
  },

  statBox: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#1C1F2B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2E40',
  },

  statNumber: {
    color: '#F2A900',
    fontWeight: '900',
    fontSize: 20,
  },

  statLabel: {
    color: '#A0A3BD',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  adminCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});