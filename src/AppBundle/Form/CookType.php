<?php

namespace AppBundle\Form;

use AppBundle\Entity\Cook;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class CookType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('first_name', TextType::class, [
                'required'  => false,
            ])
            ->add('last_name', TextType::class, [
                'required'  => false,
            ])
            ->add('family', TextType::class, [
                'required'  => false,
            ])
            ->add('patronymic', TextType::class, [
                'required'  => false,
            ])
            ->add('birthday', DateType::class, array(
                'label'=> 'settings.social.label.patronymic',
                'attr' => array(
                    'placeholder' => 'День рождения',
                ))
            )
            ->add('sex', ChoiceType::class, [
                'choices'   => Cook::getSexesList(),
                'label'     => 'Пол ешкин клеш'
            ])
            ->add('marital_status', ChoiceType::class, [
                'choices'   => Cook::getMaritalLists(),
                'label'     => 'Семейное положение'
            ])
            ->add('about', TextareaType::class, [
                'required'  => false,
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Сохранить',
                'attr'  => array(
                    'class' => 'save_btn'
                )
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Cook',
        ));
    }
}
