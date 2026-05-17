import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useModuleAuth } from "../../../../auth/hooks/useModuleAuth";
import { AuthContext } from "../../../../auth/context/AuthContext";
import { lojaAPI } from "../../services/lojaAPI";
import { getAddressByCep } from "../../services/viaCepAPI";
import { onlyNumbers } from "../../../../utils/formatters";

import {
  MapPinHouse,
  NotebookTabs,
  User,
  Users,
  UserStar,
  LogOut,
  Trash,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  MapPin,
  Loader2,
  Pencil,
  Save,
} from "lucide-react";

import "./LojaPerfil.css";

// ── Modal de Listar Endereços ──────────────────────────────────────────────
function ModalListarEnderecos({ clienteId, onClose, onAdicionar }) {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletando, setDeletando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState("");

  const carregarEnderecos = async () => {
    try {
      setLoading(true);
      const data = await lojaAPI.getEnderecos(clienteId);
      setEnderecos(data);
    } catch (err) {
      console.error("Erro ao carregar endereços:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEnderecos();
  }, [clienteId]);

  const handleDeletar = async () => {
    try {
      setDeletando(true);
      await lojaAPI.removerEndereco(clienteId, confirmDelete);
      const atualizados = enderecos.filter((e) => e.id !== confirmDelete);
      setEnderecos(atualizados);
      setConfirmDelete(null);
      if (atualizados.length === 0) onClose();
    } catch (err) {
      console.error("Erro ao deletar endereço:", err);
    } finally {
      setDeletando(false);
    }
  };

  const iniciarEdicao = (end) => {
    setEditandoId(end.id);
    setFormEdicao({ ...end });
    setErroEdicao("");
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setFormEdicao({});
    setErroEdicao("");
  };

  const handleChangeEdicao = (e) => {
    setFormEdicao((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCepBlurEdicao = async () => {
    const cep = formEdicao.cep?.replace(/\D/g, "");
    if (cep?.length !== 8) return;
    try {
      setBuscandoCep(true);
      const data = await getAddressByCep(cep);
      setFormEdicao((prev) => ({
        ...prev,
        logradouro: data.logradouro || prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.cidade || prev.cidade,
        uf: data.estado || prev.uf,
      }));
    } catch {
      setErroEdicao("CEP não encontrado.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSalvarEdicao = async () => {
    setErroEdicao("");
    const obrigatorios = ["cep", "logradouro", "bairro", "cidade", "uf", "numero"];
    for (const campo of obrigatorios) {
      if (!formEdicao[campo]?.trim()) {
        setErroEdicao("Preencha todos os campos obrigatórios.");
        return;
      }
    }
    try {
      setSalvandoEdicao(true);
      formEdicao.cep = onlyNumbers(formEdicao.cep);
      const atualizado = await lojaAPI.atualizarEndereco(clienteId, editandoId, formEdicao);
      setEnderecos((prev) =>
        prev.map((e) => (e.id === editandoId ? { ...e, ...atualizado } : e))
      );
      setEditandoId(null);
      setFormEdicao({});
    } catch (err) {
      console.error("Erro ao atualizar endereço:", err);
      setErroEdicao("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="modal-box modal-box--large"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="modal-header">
          <h3>
            <MapPin size={18} /> Meus Endereços
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {(() => {
            if (loading) {
              return (
                <div className="modal-loading">
                  <Loader2 size={24} className="spin" />
                  <span>Carregando endereços...</span>
                </div>
              );
            }
            if (enderecos.length === 0) {
              return <p className="modal-empty">Nenhum endereço cadastrado.</p>;
            }
            return (
              <ul className="endereco-list">
              {enderecos.map((end) =>
                editandoId === end.id ? (
                  /* ── Formulário de Edição inline ── */
                  <li key={end.id} className="endereco-item endereco-item--editing">
                    {erroEdicao && <p className="modal-erro">{erroEdicao}</p>}

                    <div className="form-row">
                      <label htmlFor="cep-edit">CEP *</label>
                      <div className="input-cep-wrap">
                        <input
                          id="cep-edit"
                          name="cep"
                          value={formEdicao.cep || ""}
                          onChange={handleChangeEdicao}
                          onBlur={handleCepBlurEdicao}
                          placeholder="00000-000"
                          maxLength={9}
                        />
                        {buscandoCep && <Loader2 size={16} className="spin cep-loader" />}
                      </div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="logradouro-edit">Logradouro *</label>
                      <input
                        id="logradouro-edit"
                        name="logradouro"
                        value={formEdicao.logradouro || ""}
                        onChange={handleChangeEdicao}
                        placeholder="Rua, Avenida..."
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-row">
                        <label htmlFor="numero-edit">Número *</label>
                        <input
                          id="numero-edit"
                          name="numero"
                          value={formEdicao.numero || ""}
                          onChange={handleChangeEdicao}
                          placeholder="123"
                        />
                      </div>
                      <div className="form-row">
                        <label htmlFor="complemento-edit">Complemento</label>
                        <input
                          id="complemento-edit"
                          name="complemento"
                          value={formEdicao.complemento || ""}
                          onChange={handleChangeEdicao}
                          placeholder="Apto, Bloco..."
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="bairro-edit">Bairro *</label>
                      <input
                        id="bairro-edit"
                        name="bairro"
                        value={formEdicao.bairro || ""}
                        onChange={handleChangeEdicao}
                        placeholder="Bairro"
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-row">
                        <label htmlFor="cidade-edit">Cidade *</label>
                        <input
                          id="cidade-edit"
                          name="cidade"
                          value={formEdicao.cidade || ""}
                          onChange={handleChangeEdicao}
                          placeholder="Cidade"
                        />
                      </div>
                      <div className="form-row">
                        <label htmlFor="uf-edit">UF *</label>
                        <input
                          id="uf-edit"
                          name="uf"
                          value={formEdicao.uf || ""}
                          onChange={handleChangeEdicao}
                          placeholder="SP"
                          maxLength={2}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="tipoEndereco-edit">Tipo de Endereço</label>
                      <select
                        id="tipoEndereco-edit"
                        name="tipoEndereco"
                        value={formEdicao.tipoEndereco || "RESIDENCIAL"}
                        onChange={handleChangeEdicao}
                      >
                        <option value="RESIDENCIAL">Residencial</option>
                        <option value="COMERCIAL">Comercial</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>

                    <div className="edicao-actions">
                      <button
                        className="btn-cancel"
                        onClick={cancelarEdicao}
                        disabled={salvandoEdicao}
                      >
                        <X size={14} /> Cancelar
                      </button>
                      <button
                        className="btn-salvar"
                        onClick={handleSalvarEdicao}
                        disabled={salvandoEdicao}
                      >
                        {salvandoEdicao ? (
                          <Loader2 size={14} className="spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        Salvar
                      </button>
                    </div>
                  </li>
                ) : (
                  /* ── Visualização normal ── */
                  <li key={end.id} className="endereco-item">
                    <div className="endereco-info">
                      <span className="endereco-tipo">{end.tipoEndereco}</span>
                      <span className="endereco-linha">
                        {end.logradouro}, {end.numero}
                        {end.complemento ? ` - ${end.complemento}` : ""}
                      </span>
                      <span className="endereco-linha">
                        {end.bairro} — {end.cidade}/{end.uf}
                      </span>
                      <span className="endereco-cep">CEP: {end.cep}</span>
                    </div>
                    <div className="endereco-acoes">
                      <button
                        className="btn-icon-edit"
                        onClick={() => iniciarEdicao(end)}
                        title="Editar endereço"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-icon-delete"
                        onClick={() => setConfirmDelete(end.id)}
                        title="Remover endereço"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                )
              )}
              </ul>
            );
          })()}

          {/* Confirmação de delete */}
          {confirmDelete && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <AlertTriangle size={28} color="#e74c3c" />
                <p>Deseja remover este endereço? Esta ação não pode ser desfeita.</p>
                <div className="confirm-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setConfirmDelete(null)}
                    disabled={deletando}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-confirm-delete"
                    onClick={handleDeletar}
                    disabled={deletando}
                  >
                    {deletando ? (
                      <Loader2 size={14} className="spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-action" onClick={onAdicionar}>
            <Plus size={16} /> Adicionar novo endereço
          </button>
        </div>
      </div>
    </div>
  );
}

ModalListarEnderecos.propTypes = {
  clienteId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdicionar: PropTypes.func.isRequired,
};

// ── Modal de Adicionar Endereço ────────────────────────────────────────────
function ModalAdicionarEndereco({ clienteId, onClose, onSucesso }) {
  const [form, setForm] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
    complemento: "",
    tipoEndereco: "RESIDENCIAL",
  });
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      setBuscandoCep(true);
      const data = await getAddressByCep(cep);
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        uf: data.estado || "",
      }));
    } catch {
      setErro("CEP não encontrado.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async () => {
    setErro("");
    const obrigatorios = ["cep", "logradouro", "bairro", "cidade", "uf", "numero"];
    for (const campo of obrigatorios) {
      if (!form[campo].trim()) {
        setErro("Preencha todos os campos obrigatórios.");
        return;
      }
    }
    try {
      setSalvando(true);
      form.cep = onlyNumbers(form.cep);
      await lojaAPI.adicionarEndereco(clienteId, form);
      onSucesso();
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      setErro("Erro ao salvar endereço. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="modal-header">
          <h3>
            <Plus size={18} /> Novo Endereço
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {erro && <p className="modal-erro">{erro}</p>}

          <div className="form-row">
            <label htmlFor="cep-add">CEP *</label>
            <div className="input-cep-wrap">
              <input
                id="cep-add"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {buscandoCep && <Loader2 size={16} className="spin cep-loader" />}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="logradouro-add">Logradouro *</label>
            <input
              id="logradouro-add"
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              placeholder="Rua, Avenida..."
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label htmlFor="numero-add">Número *</label>
              <input
                id="numero-add"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="123"
              />
            </div>
            <div className="form-row">
              <label htmlFor="complemento-add">Complemento</label>
              <input
                id="complemento-add"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Apto, Bloco..."
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="bairro-add">Bairro *</label>
            <input
              id="bairro-add"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              placeholder="Bairro"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label htmlFor="cidade-add">Cidade *</label>
              <input
                id="cidade-add"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
              />
            </div>
            <div className="form-row">
              <label htmlFor="uf-add">UF *</label>
              <input
                id="uf-add"
                name="uf"
                value={form.uf}
                onChange={handleChange}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="tipoEndereco-add">Tipo de Endereço</label>
            <select id="tipoEndereco-add" name="tipoEndereco" value={form.tipoEndereco} onChange={handleChange}>
              <option value="RESIDENCIAL">Residencial</option>
              <option value="COMERCIAL">Comercial</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel-modal" onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button className="btn-salvar" onClick={handleSubmit} disabled={salvando}>
            {salvando ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
            Salvar Endereço
          </button>
        </div>
      </div>
    </div>
  );
}

ModalAdicionarEndereco.propTypes = {
  clienteId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSucesso: PropTypes.func.isRequired,
};

// ── Modal de Confirmação de Deletar Conta ─────────────────────────────────
function ModalDeletarConta({ onClose, onConfirmar, deletando }) {
  const [confirmText, setConfirmText] = useState("");
  const textoEsperado = "DELETAR";
  const confirmacaoValida = confirmText === textoEsperado;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="modal-box modal-box--danger"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="modal-header modal-header--danger">
          <h3>
            <AlertTriangle size={18} /> Deletar Conta
          </h3>
          <button className="modal-close" onClick={onClose} disabled={deletando}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="danger-warning">
            <AlertTriangle size={40} color="#e74c3c" />
            <p className="danger-title">Esta ação é permanente e irreversível.</p>
            <p className="danger-desc">
              Ao deletar sua conta, todos os seus dados, pedidos e endereços serão
              permanentemente removidos. Não será possível recuperar as informações.
            </p>
          </div>

          <div className="form-row confirm-text-row">
            <label>
              Digite <strong>{textoEsperado}</strong> para confirmar:
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={textoEsperado}
              disabled={deletando}
              className={confirmacaoValida ? "input-valid" : ""}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel-modal" onClick={onClose} disabled={deletando}>
            Cancelar
          </button>
          <button
            className="btn-confirm-delete btn-confirm-delete--full"
            onClick={onConfirmar}
            disabled={!confirmacaoValida || deletando}
          >
            {deletando ? (
              <>
                <Loader2 size={14} className="spin" /> Deletando...
              </>
            ) : (
              <>
                <Trash size={14} /> Deletar Minha Conta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

ModalDeletarConta.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirmar: PropTypes.func.isRequired,
  deletando: PropTypes.bool.isRequired,
};

// ── Componente Principal ───────────────────────────────────────────────────
export default function LojaPerfil() {
  const { saveLastPath } = useContext(AuthContext);
  const { user, logout } = useModuleAuth("loja");
  const navigate = useNavigate();

  const [modal, setModal] = useState(null); // null | "listar" | "adicionar" | "deletarConta"
  const [deletandoConta, setDeletandoConta] = useState(false);

  const clienteId = user?.clienteId;

  const handleLogout = () => {
    logout();
    saveLastPath("loja", "/loja/login");
    navigate("/");
  };

  const handleDeletarConta = async () => {
    try {
      setDeletandoConta(true);
      await lojaAPI.deletarCliente(clienteId);
      logout();
      saveLastPath("loja", "/loja/login");
      navigate("/");
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      setDeletandoConta(false);
      // Opcionalmente: exibir toast/snackbar de erro aqui
    }
  };

  return (
    <div className="loja-page">
      <div className="page-header">
        <h1>
          <User /> Perfil
        </h1>
        <p className="page-subtitle">Gerencie seus dados pessoais</p>
      </div>

      <div className="perfil-container">
        <div className="perfil-card">
          <h2>Informações Pessoais</h2>

          <div className="info-row">
            <span className="info-label">Nome:</span>
            <span className="info-value">{user?.nome}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Tipo de Conta:</span>
            <span className="info-value">
              {user?.tipo === "admin" ? (
                <>
                  <UserStar size={16} style={{ marginRight: "6px" }} />
                  Administrador
                </>
              ) : (
                <>
                  <Users size={16} style={{ marginRight: "6px" }} />
                  Cliente
                </>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Data de Cadastro:</span>
            <span className="info-value">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="perfil-card">
          <h2>Endereço de Entrega</h2>

          <button className="btn-action" onClick={() => setModal("adicionar")}>
            <MapPinHouse size={16} /> Adicionar Endereço
          </button>
          <button className="btn-action" onClick={() => setModal("listar")}>
            <NotebookTabs size={16} /> Meus Endereços
          </button>
        </div>

        {user?.tipo === "admin" && (
          <div className="perfil-card admin">
            <h2>⚙️ Painel Administrativo</h2>
            <p>Você tem acesso às ferramentas administrativas da loja.</p>
            <button className="btn-action">
              <NotebookTabs size={16} /> Dashboard Admin
            </button>
          </div>
        )}

        <div className="perfil-card danger">
          <h2>Zona de Perigo</h2>

          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Sair da Conta
          </button>

          <button className="btn-delete" onClick={() => setModal("deletarConta")}>
            <Trash size={16} /> Deletar Conta
          </button>

          <p className="warning-text">
            Atenção: Deletar sua conta é permanente. Todos os dados serão removidos.
          </p>
        </div>
      </div>

      {/* Modais */}
      {modal === "listar" && (
        <ModalListarEnderecos
          clienteId={clienteId}
          onClose={() => setModal(null)}
          onAdicionar={() => setModal("adicionar")}
        />
      )}

      {modal === "adicionar" && (
        <ModalAdicionarEndereco
          clienteId={clienteId}
          onClose={() => setModal(null)}
          onSucesso={() => setModal("listar")}
        />
      )}

      {modal === "deletarConta" && (
        <ModalDeletarConta
          onClose={() => !deletandoConta && setModal(null)}
          onConfirmar={handleDeletarConta}
          deletando={deletandoConta}
        />
      )}
    </div>
  );
}