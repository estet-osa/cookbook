<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use AppBundle\Entity\Ingredients;

class RecipeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, array(
                    'label'=> 'Название блюда',
                    'required'  => true,
                    'attr' => array(
                        'placeholder' => 'Название блюда',
                        'class' => 'recipe_inpt'
                    )
            ))
            ->add('description', TextareaType::class, array(
                'label'=> 'Описание блюда',
                'attr' => [
                    'placeholder' => 'Подробное описание, рецепт',
                    'class' => 'recipe_area'
                ])
            )
            ->add('brochure', FileType::class, [
                'label' => 'Attach image',
                'data_class' => null
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
            'data_class' => 'AppBundle\Entity\Recipe',
        ));
    }
}
