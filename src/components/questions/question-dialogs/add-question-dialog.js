import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import lessonsActions from "../../../redux/actions/lessons";
import { QuestionDialog } from "./question-dialog";
import questionsActions from "../../../redux/actions/questions";

const multipleChoiceFormInitialState = [
  {
    type: "text",
    value: "",
    options: [
      { value: "", isAnswer: true },
      { value: "", isAnswer: false },
    ],
  },
];

export const AddQuestionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState(
    multipleChoiceFormInitialState
  );
  const params = useParams();
  const dispatch = useDispatch();
  const QUESTION_TYPES = useSelector((state) => state.questions.questionTypes);

  function closeModal() {
    setIsOpen(false);
    setQuestionForm(multipleChoiceFormInitialState);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleStatementChange = (e) => {
    const questionFormCopy = [...questionForm];
    const statementIndex = e.target.name.split("-")[1];
    questionFormCopy[statementIndex].value = e.target.value;
    setQuestionForm(questionFormCopy);
  };

  const addStatement = () => {
    setQuestionForm([
      ...questionForm,
      {
        type: "",
        value: "",
        options: [],
      },
    ]);
  };

  const handleOptionsChange = (e) => {
    const optionsCopy = [...questionForm[0].options];
    const optionIndex = e.target.name.split("-")[1];
    optionsCopy[optionIndex].value = e.target.value;
    setQuestionForm([
      {
        ...questionForm[0],
        options: optionsCopy,
      },
    ]);
  };

  const handleRadioButtonChange = (e) => {
    const optionsCopy = [...questionForm[0].options];
    const lastAnswerIndex = questionForm[0].options.findIndex(
      (elem) => elem.isAnswer === true
    );
    if (lastAnswerIndex !== -1) optionsCopy[lastAnswerIndex].isAnswer = false;
    const newAnswerIndex = e.target.name.split("-")[1];
    optionsCopy[newAnswerIndex].isAnswer = true;
    setQuestionForm([
      {
        ...questionForm[0],
        options: optionsCopy,
      },
    ]);
  };

  const handleDeleteOption = (i) => {
    let optionsCopy = [...questionForm[0].options];
    optionsCopy = [...optionsCopy.slice(0, i), ...optionsCopy.slice(i + 1)];
    setQuestionForm([
      {
        ...questionForm[0],
        options: optionsCopy,
      },
    ]);
  };

  const onSubmitMultipleChoice = () => {
    if (
      questionForm[0].value === "" ||
      questionForm[0].options.some((option) => option.value === "")
    ) {
      return alert("Faltan campos por llenar");
    }
    if (!questionForm[0].options.some((option) => option.isAnswer === true)) {
      return alert("Falta elegir la respuesta");
    }
    const newQuestion = {
      type: QUESTION_TYPES["MULT_CHOICE"],
      statements: questionForm,
      lessonId: params.id,
    };
    dispatch(questionsActions.addQuestion(newQuestion))
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <QuestionDialog
      {...{
        openModal,
        closeModal,
        handleStatementChange,
        handleOptionsChange,
        handleRadioButtonChange,
        handleDeleteOption,
        isOpen,
        questionForm,
        setQuestionForm,
        onSubmitMultipleChoice,
        dialogTrigger: (
          <div className="open-dialog-button-container">
            <button
              type="button"
              className="open-dialog-button"
              onClick={openModal}
            >
              Agregar Pregunta
            </button>
          </div>
        ),
        submitButtonText: "Agregar Pregunta",
      }}
    />
  );
};
