<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class CommentsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('description', TextareaType::class, [
                'label' => false,
                'attr'  => array(
                    'placeholder' => 'Скажите, что бы вам было хорошо.'
                )
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Сохранить',
                'attr'  => array(
                    'class' => 'save_btn',
                    'onclick' => 'return rcp.addComment(this)'
                )
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Comments',
        ));
    }
}
